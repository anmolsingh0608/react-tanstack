import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    queryKey: ["fetch-event", { id }],
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async ({ event, id }) => {
      const oldEventData = queryClient.getQueryData(["fetch-event", { id }]);

      await queryClient.cancelQueries({ queryKey: ["fetch-event", { id }] });
      queryClient.setQueryData(["fetch-event", { id }], event);

      return { oldEventData };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["fetch-event", { id }], context.oldEventData);
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["fetch-event", { id }] });
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    handleClose();
  }

  function handleClose() {
    navigate("../");
  }

  let content;
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  if (isError) {
    content = (
      <ErrorBlock title={"An error occurred"} message={error.info?.message} />
    );
  }

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
