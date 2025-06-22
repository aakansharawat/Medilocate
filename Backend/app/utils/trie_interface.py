# app/utils/trie_interface.py

import sys
import os

# Ensure Python can find the compiled C++ module (medicine_trie.pyd)
cpp_module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'cpp', 'build', 'Release'))
if cpp_module_path not in sys.path:
    sys.path.append(cpp_module_path)

try:
    import medicine_trie
    CPP_AVAILABLE = True
except ImportError as e:
    print("Failed to import medicine_trie module:", str(e))
    print("Using Python fallback for trie functionality")
    medicine_trie = None
    CPP_AVAILABLE = False

# Python fallback implementation
class PythonMedicineTrie:
    def __init__(self):
        self.medicines = set()
    
    def insert(self, name):
        self.medicines.add(name.lower())
    
    def search_by_prefix(self, prefix):
        prefix = prefix.lower()
        return [med for med in self.medicines if med.startswith(prefix)][:10]

trie = None

def build_trie(medicine_names):
    global trie
    if CPP_AVAILABLE and medicine_trie is not None:
        trie = medicine_trie.MedicineTrie()
        for name in medicine_names:
            trie.insert(name)
    else:
        # Use Python fallback
        trie = PythonMedicineTrie()
        for name in medicine_names:
            trie.insert(name)

def search_medicine_prefix(prefix):
    if trie is None:
        return []
    return trie.search_by_prefix(prefix)
