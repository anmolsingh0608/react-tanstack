import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isError, error, isFetching } = useQuery({
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
    queryKey: ["fetch-event", { id }],
  });

  const {
    mutate,
    isLoading,
    isError: isErrorDel,
    error: errorDel,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      navigate("/events");
    },
  });

  const handleDelete = () => {
    const isConfirmed = true;
    if (isConfirmed) {
      mutate({ id });
    }
  };

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {data && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={handleDelete}>Delete</button>
                <Link to="edit">Edit</Link>
              </nav>
            </header>
            {isLoading && <p>Deleting...</p>}
            {isErrorDel && (
              <ErrorBlock
                title={"An error occurred"}
                message={errorDel.info?.message || "Something went wrong"}
              />
            )}
            <div id="event-details-content">
              <img src={"http://127.0.0.1:3000/" + data.image} alt="" />
              <div id="event-details-info">
                <div>
                  <p id="event-details-location">{data.location}</p>
                  <time dateTime={`Todo-DateT$Todo-Time`}>{data.time}</time>
                </div>
                <p id="event-details-description">{data.description}</p>
              </div>
            </div>
          </>
        )}
        {isFetching && <p>Loading...</p>}
        {isError && (
          <ErrorBlock
            title={"An error occurred"}
            message={error.info?.message || "Something went wrong"}
          />
        )}
      </article>
    </>
  );
}
