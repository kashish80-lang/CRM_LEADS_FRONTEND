import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateLead } from "../api/leads";

const schema = z.object({
  name: z.string().min(1),

  email: z.string().email(),

  source: z.string().min(1),

  status: z.string(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  lead: any;

  onClose: () => void;
};

function EditLeadModal({
  lead,
  onClose,
}: Props) {

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: lead.name,
      email: lead.email,
      source: lead.source,
      status: lead.status,
    },
  });

  const mutation = useMutation({
    mutationFn: updateLead,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });

      onClose();
    },
  });

  const onSubmit = (data: FormData) => {

    mutation.mutate({
      id: lead.id,

      data: {
        ...lead,
        ...data,

        updated_at:
          new Date().toISOString(),
      },
    });
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-bold">
            Edit Lead
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {/* Name */}
          <div>

            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full border p-3 rounded-lg"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                Name is required
              </p>
            )}

          </div>

          {/* Email */}
          <div>

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border p-3 rounded-lg"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Invalid email
              </p>
            )}

          </div>

          {/* Source */}
          <div>

            <input
              type="text"
              placeholder="Source"
              {...register("source")}
              className="w-full border p-3 rounded-lg"
            />

          </div>

          {/* Status */}
          <div>

            <select
              {...register("status")}
              className="w-full border p-3 rounded-lg"
            >

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

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-300 py-3 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >

              {mutation.isPending
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditLeadModal;