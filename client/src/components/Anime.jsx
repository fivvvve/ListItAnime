//Packages
import Axios from "axios";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Cookies from "js-cookie";

//Components
import GiveScore from "./GiveScore";
import ShowInfoAnime from "./ShowInfoAnime";

//Styles
import "./Anime.css";

function Anime({
  mal_id,
  title,
  image,
  sinopse,
  modalOpen,
  setModalOpen,
  toWatch,
  watched,
  setRenderAgain,
}) {
  const [anime, setAnime] = useState();
  const [show, setShow] = useState(false);
  const [showToWatch, setShowToWatch] = useState(false);
  const [showWatched, setshowWatched] = useState(false);
  const [removed, setRemoved] = useState();
  const [markWatched, setMarkWatched] = useState(false);
  const [editScore, setEditScore] = useState(false);

  const getAnime = async (id) => {
    if (!modalOpen) {
      const response = await Axios.get("https://list-it-anime-dudh.vercel.app/anime?id=" + id);
      setAnime(response.data);
      setModalOpen(true);
      setShow(!show);
    }
  };

  const removeAnime = async (id, list) => {
    const response = (
      await Axios.get("https://list-it-anime-dudh.vercel.app/removeAnime", {
        params: { mal_id: id, userId: Cookies.get("id"), listName: list },
      })
    ).data;

    if (response === "Removed") setRemoved(true);
    if (setRenderAgain) setRenderAgain((state) => !state)
  };

  return (
    <>
      {show ? (
        <ShowInfoAnime
          anime={anime}
          setShow={setShow}
          setModalOpen={setModalOpen}
        />
      ) : null}
      {toWatch ? (
        <>
          {markWatched && (
            <>
              <GiveScore
                setMarkWatched={setMarkWatched}
                animeTitle={title}
                animeId={mal_id}
                image={image}
                sinopse={sinopse}
                setRenderAgain={setRenderAgain}
              />
            </>
          )}

          <div
            className="anime"
            onMouseEnter={() => setShowToWatch(true)}
            onMouseLeave={() => setShowToWatch(false)}
          >
            {showToWatch && (
              <div className="addWatch">
                <FaTrashAlt
                  className="trash-can"
                  onClick={() => removeAnime(mal_id, "To Watch")}
                />
                <button
                  className="mark-watched"
                  onClick={() => setMarkWatched(true)}
                >
                  Mark as Watched
                </button>
              </div>
            )}

            <div>
              <figure>
                <img src={image} alt={title + " image"} />
              </figure>
              {title && <p className="text">{title}</p>}
            </div>
          </div>
        </>
      ) : watched ? (
        <>
          {editScore && (
            <GiveScore
              setMarkWatched={setEditScore}
              animeTitle={title}
              animeId={mal_id}
              editScore={true}
              setRenderAgain={setRenderAgain}
            />
          )}

          <div
            className="anime"
            onMouseEnter={() => setshowWatched(true)}
            onMouseLeave={() => setshowWatched(false)}
          >
            <div className="editArea">
              {showWatched && (
                <div className="addWatch">
                  <FaTrashAlt
                    className="trash-can"
                    onClick={() => removeAnime(mal_id, "Watched")}
                  />
                  <button
                    className="mark-watched"
                    onClick={() => setEditScore(true)}
                  >
                    Edit Score
                  </button>
                </div>
              )}

              <figure>
                <img src={image} alt={title + " image"} />
              </figure>
            </div>
            {title && <p className="text">{title}</p>}
          </div>
        </>
      ) : (
        <div className="anime">
          <figure onClick={() => getAnime(mal_id)}>
            <img src={image} alt={title + " image"} />
          </figure>
          {title && <p className="text">{title}</p>}
        </div>
      )}
    </>
  );
}

export default Anime;
