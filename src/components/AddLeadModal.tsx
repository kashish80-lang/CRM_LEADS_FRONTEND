import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLead } from "../api/leads";

const schema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email"),

  source: z.string().min(1, "Source is required"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onClose: () => void;
};

function AddLeadModal({ onClose }: Props) {

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: createLead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });

      onClose();
    },
  });

  const onSubmit = (data: FormData) => {

    mutation.mutate({
      ...data,

      status: "NEW",

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString(),
    });
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-full max-w-md">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-bold">
            Add Lead
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <div>

            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full border p-3 rounded-lg"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}

          </div>

          <div>

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border p-3 rounded-lg"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

          </div>

          <div>

            <input
              type="text"
              placeholder="Source"
              {...register("source")}
              className="w-full border p-3 rounded-lg"
            />

            {errors.source && (
              <p className="text-red-500 text-sm mt-1">
                {errors.source.message}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={!isValid || mutation.isPending}
            className="w-full bg-black text-white py-3 rounded-lg disabled:bg-gray-400"
          >

            {mutation.isPending
              ? "Creating..."
              : "Create Lead"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddLeadModal;