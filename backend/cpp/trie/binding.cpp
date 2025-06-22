#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "medicine_trie.h"

namespace py = pybind11;

PYBIND11_MODULE(medicine_trie, m) {
    py::class_<MedicineTrie>(m, "MedicineTrie")
        .def(py::init<>())
        .def("insert", &MedicineTrie::insert)
        .def("search_by_prefix", &MedicineTrie::search_by_prefix);
}
