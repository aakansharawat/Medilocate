# app/routes/search.py

from flask import Blueprint, request, jsonify
from app.models import User, Inventory, Medicine
from app import db
from geopy.geocoders import Nominatim
from math import radians, cos, sin, asin, sqrt
from app.utils.graph_interface import find_shortest_path  # ✅ Dijkstra wrapper


# Import the Trie builder and search function
from app.utils.trie_interface import build_trie, search_medicine_prefix

search_bp = Blueprint('search', __name__)
geolocator = Nominatim(user_agent="medilocate")

# 🌟 On app start, preload all medicine names into the Trie
@search_bp.before_app_first_request
def preload_trie():
    try:
        med_names = db.session.query(Medicine.name).distinct().all()
        build_trie([m[0] for m in med_names])  # m[0] extracts the string
        print("✅ Trie preloaded with medicine names.")
    except Exception as e:
        print("❌ Error loading Trie:", e)

# 🔍 GET: Auto-suggest using Trie
@search_bp.route('/api/search_by_prefix', methods=['GET'])
def search_by_prefix():
    prefix = request.args.get('prefix', '')
    results = search_medicine_prefix(prefix)
    return jsonify({'results': results})

# 📍 POST: Find nearest pharmacies with medicine
@search_bp.route('/api/search_medicine', methods=['POST'])
def search_medicine():
    data = request.get_json()
    address = data.get('address')
    medicine_name = data.get('medicine_name')

    if not address or not medicine_name:
        return jsonify({"error": "Address and medicine_name are required"}), 400

    try:
        location = geolocator.geocode(address)
        if not location:
            return jsonify({"error": "Invalid address"}), 400

        user_lat = location.latitude
        user_lon = location.longitude

        inventory_items = (
            db.session.query(Inventory, User)
            .join(User, User.id == Inventory.pharmacy_id)
            .filter(User.is_pharmacy == True)
            .filter(Inventory.name.ilike(f"%{medicine_name}%"))
            .all()
        )

        pharmacies_found = {}

        for item, pharmacy_user in inventory_items:
            pharmacy_id = item.pharmacy_id
            
            if pharmacy_id not in pharmacies_found:
                if pharmacy_user.latitude is not None and pharmacy_user.longitude is not None:
                    distance = calculate_distance(user_lat, user_lon, pharmacy_user.latitude, pharmacy_user.longitude)
                    pharmacies_found[pharmacy_id] = {
                        "details": {
                            "pharmacy_name": pharmacy_user.name,
                            "pharmacy_address": pharmacy_user.address,
                            "distance_km": round(distance, 2)
                        },
                        "medicines": {}
                    }
            
            if pharmacy_id in pharmacies_found:
                med_name = item.name
                if med_name not in pharmacies_found[pharmacy_id]['medicines']:
                    pharmacies_found[pharmacy_id]['medicines'][med_name] = {
                        'total_stock': 0,
                        'batches': []
                    }
                
                pharmacies_found[pharmacy_id]['medicines'][med_name]['total_stock'] += item.stock
                pharmacies_found[pharmacy_id]['medicines'][med_name]['batches'].append({
                    "price": item.price,
                    "expiry_date": item.expiry_date.strftime('%Y-%m-%d'),
                })

        results = []
        for pharmacy_id, data in pharmacies_found.items():
            medicines_list = []
            if not data['medicines']:
                continue

            for name, med_data in data['medicines'].items():
                if not med_data['batches']:
                    continue
                
                min_price = min(b['price'] for b in med_data['batches'])
                earliest_expiry = min(b['expiry_date'] for b in med_data['batches'])

                medicines_list.append({
                    "medicine_name": name,
                    "stock": med_data['total_stock'],
                    "price": min_price,
                    "expiry_date": earliest_expiry,
                })

            results.append({
                "details": data['details'],
                "medicines": medicines_list
            })

        sorted_results = sorted(results, key=lambda p: p['details']['distance_km'])

        return jsonify({"results": sorted_results}), 200

    except Exception as e:
        print("Search Error:", str(e))
        return jsonify({"error": "Something went wrong during search"}), 500


# 🧮 Helper: Haversine Distance Formula
def calculate_distance(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km

@search_bp.route('/api/find_nearest_path', methods=['POST'])
def find_nearest_path():
    data = request.get_json()
    address = data.get('address')
    medicine_name = data.get('medicine_name')

    if not address or not medicine_name:
        return jsonify({"error": "Address and medicine_name are required"}), 400

    # Geocode user address
    location = geolocator.geocode(address)
    if not location:
        return jsonify({"error": "Invalid address"}), 400

    user_lat = location.latitude
    user_lon = location.longitude

    # Fetch pharmacies with the medicine
    inventory_data = (
        db.session.query(User.id, User.name, User.latitude, User.longitude, Inventory.name, Inventory.stock)
        .join(Inventory, Inventory.pharmacy_id == User.id)
        .filter(User.is_pharmacy == True)
        .filter(Inventory.name.ilike(f"%{medicine_name}%"))
        .filter(User.latitude.isnot(None), User.longitude.isnot(None))
        .all()
    )

    if not inventory_data:
        return jsonify({"error": "No pharmacies found with this medicine"}), 404

    # Build graph with Haversine distance
    nodes = {
        str(pharmacy.id): (pharmacy.latitude, pharmacy.longitude)
        for pharmacy in db.session.query(User).filter(User.is_pharmacy==True).all()
        if pharmacy.latitude and pharmacy.longitude
    }

    graph = {}

    def haversine(lat1, lon1, lat2, lon2):
        from math import radians, sin, cos, sqrt, atan2
        R = 6371
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return R * c

    for id1, (lat1, lon1) in nodes.items():
        graph[id1] = []
        for id2, (lat2, lon2) in nodes.items():
            if id1 != id2:
                graph[id1].append((id2, haversine(lat1, lon1, lat2, lon2)))

    # Add user node
    user_node = "USER"
    graph[user_node] = []
    for pid, (plat, plon) in nodes.items():
        distance = haversine(user_lat, user_lon, plat, plon)
        graph[user_node].append((pid, distance))

    # Try Dijkstra to each matching pharmacy
    targets = [str(pharmacy.id) for pharmacy in inventory_data]
    shortest_path = None
    shortest_len = float("inf")
    final_target = None

    for target in targets:
        path = find_shortest_path(graph, user_node, target)
        if path and len(path) < shortest_len:
            shortest_path = path
            shortest_len = len(path)
            final_target = target

    if not shortest_path:
        return jsonify({"error": "No reachable pharmacy found"}), 404

    pharmacy = db.session.query(User).filter_by(id=int(final_target)).first()

    return jsonify({
        "path": shortest_path,
        "nearest_pharmacy": {
            "id": pharmacy.id,
            "name": pharmacy.name,
            "address": pharmacy.address,
            "latitude": pharmacy.latitude,
            "longitude": pharmacy.longitude
    }
    })
