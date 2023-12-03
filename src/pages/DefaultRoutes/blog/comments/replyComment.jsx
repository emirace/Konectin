import axios from "axios";
import { useState } from "react";
import * as BiIcons from "react-icons/bi";
import * as TbIcons from "react-icons/tb";
import { Link } from "react-router-dom";

function ReplyComment({
  isReply,
  commentId,
  updateComment,
  pathname,
  setLoading,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || "";
  const url = import.meta.env.VITE_CLIENT_SERVER_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (user?._id) {
      axios
        .post(
          `${url}/replyComment?commentId=${commentId}&userId=${user._id}`,
          { comment: content },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          updateComment((prev) => [
            {
              _id: res.data.comment,
              userId: user._id,
              fullname: user.fullname,
              commentId: commentId,
              comment: content,
              likes: [],
              numOfShares: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...prev,
          ]);

          setLoading(false);
          setContent("");
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setError(
            <p className="text-error-500">{err.response.data.message}</p>
          );
        });
    } else {
      setError(
        <p className="text-red-500">
          You have to be logged in to comment.{" "}
          <Link
            onClick={() => sessionStorage.setItem("status", pathname)}
            className="text-primary-500"
            to="/login"
          >
            Click here to log in
          </Link>
        </p>
      );
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={`${
          isReply
            ? "opacity-100 relative left-0"
            : "opacity-0 absolute left-full"
        } transition-all duration-500 flex items-center gap-2 my-2 pr-3`}
      >
        <div className="rounded-full bg-neutral-1000 flex items-center justify-center w-8 h-8">
          {user?.fullname !== undefined ? (
            <h3 className="text-capitalize text-neutral-100">
              {user?.fullname.split(" ")[0].charAt(0)}
              {user?.fullname.split(" ")[1].charAt(0)}
            </h3>
          ) : (
            <BiIcons.BiUser />
          )}
        </div>
        <input
          id="subComment"
          name="subComment"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="pl-4 pr-8 py-3 text-xs flex-1 rounded-md outline-0 bg-neutral-1000 border border-neutral-500"
        />
        <button
          type="submit"
          className={`${
            content.length >= 1 ? "opacity-100 right-6" : "opacity-0 right-3"
          } absolute duration-500`}
        >
          <TbIcons.TbSend className="text-secondary-500" size="1.2rem" />
        </button>
      </form>
      {error && error}
    </div>
  );
}

export default ReplyComment;
