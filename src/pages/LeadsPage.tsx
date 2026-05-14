import { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getLeads,
  deleteLead,
} from "../api/leads";

import AddLeadModal from "../components/AddLeadModal";

import EditLeadModal from "../components/EditLeadModal";

type Lead = {
  id: number;
  name: string;
  email: string;
  status: string;
  source: string;
};

function LeadsPage() {

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const queryClient = useQueryClient();

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });

  const filteredLeads = leads.filter(
    (lead: Lead) => {

      const matchesSearch =
        lead.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  if (isLoading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 text-xl">
        Error fetching leads
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Mini Lead CRM
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your sales leads
            </p>

          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Lead
          </button>

        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow p-5">

          {/* Search + Filter */}
          <div className="flex gap-4 mb-5">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border p-2 rounded-lg w-full"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border p-2 rounded-lg"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="NEW">
                NEW
              </option>

              <option value="CONTACTED">
                CONTACTED
              </option>

              <option value="QUALIFIED">
                QUALIFIED
              </option>

              <option value="CONVERTED">
                CONVERTED
              </option>

              <option value="LOST">
                LOST
              </option>

            </select>

          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No leads found
            </div>

          ) : (

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b text-left bg-gray-50">

                  <th className="p-3">
                    Name
                  </th>

                  <th className="p-3">
                    Email
                  </th>

                  <th className="p-3">
                    Status
                  </th>

                  <th className="p-3">
                    Source
                  </th>

                  <th className="p-3">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeads.map((lead: Lead) => (

                  <tr
                    key={lead.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-3 font-medium">
                      {lead.name}
                    </td>

                    <td className="p-3">
                      {lead.email}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          lead.status === "NEW"
                            ? "bg-gray-200 text-gray-700"
                            : lead.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-700"
                            : lead.status === "QUALIFIED"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.status === "CONVERTED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {lead.status}

                      </span>

                    </td>

                    <td className="p-3">
                      {lead.source}
                    </td>

                    <td className="p-3">

                      <div className="flex gap-3">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            setSelectedLead(lead)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {

                            const confirmDelete =
                              window.confirm(
                                "Are you sure you want to delete this lead?"
                              );

                            if (confirmDelete) {
                              deleteMutation.mutate(
                                lead.id
                              );
                            }
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* Add Modal */}
      {openModal && (
        <AddLeadModal
          onClose={() =>
            setOpenModal(false)
          }
        />
      )}

      {/* Edit Modal */}
      {selectedLead && (
        <EditLeadModal
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
        />
      )}

    </div>
  );
}

export default LeadsPage;