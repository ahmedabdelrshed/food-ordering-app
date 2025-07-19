"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteCategory } from "../_actions/category";
import toast from "react-hot-toast";

type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

function DeleteCategory({ id }: { id: string }) {
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async () => {
    try {
      setState((prev) => {
        return { ...prev, isLoading: true };
      });
      const res = await deleteCategory(id);
      setState((prev) => {
        return { ...prev, message: res.message, status: res.status };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, isLoading: false };
      });
    }
  };
  useEffect(() => {
    if (state.status === 200) {
      toast.success(`${state.message}`);
    }
    if (state.status === 500) {
      toast.error(`${state.message}`);
    }
  }, [state.message, state.status]);

  return (
    <Button
      variant="secondary"
      className="cursor-pointer hover:!bg-red-600 hover:text-white"
      disabled={state.isLoading}
      onClick={handleDelete}
    >
      <Trash2 />
    </Button>
  );
}

export default DeleteCategory;
