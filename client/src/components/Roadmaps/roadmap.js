import React, { useEffect, useState,Suspense, lazy } from "react";
import slugify from 'slugify'
import axios from "axios";
import Loader from "../Loader/Loader";
import roadmaps from './RoadMapsList'
import "./roadmaps.scss";

const RoadmapCard = lazy(() => import("./RoadmapCard.js"));

const Roadmap = () => {
  const [loading, setLoading] = useState(false)
  const [avRoadmaps, setAvRoadmaps] = useState([])

  function getAvailableRoadmap(data) {
    let res = []
    for(let i = 0;i<roadmaps.length;i++) {
      let temp = []
      for(let j = 0;j<roadmaps[i].topics.length;j++) {
        data.forEach(element => {
          let url = slugify(roadmaps[i].topics[j].title.toLowerCase(), {remove: /[*+~.()'"!:@//\\?]/g})
          if(element.url === url) {
            temp.push(roadmaps[i].topics[j])
          }
        });
      }
      if(temp.length > 0) {
        res.push({...roadmaps[i],topics:temp})
       }
    }

    return res;
  }

  useEffect(() => {
    setLoading(true);
    //scroll to top when mounted;
    window.scrollTo(0, 0);
    axios
      .get(`/api/roadmaps`)
      .then((res) => {
        let r = getAvailableRoadmap(res.data)
        setAvRoadmaps(r)
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  },[]);

  return (
    <Suspense fallback={<Loader />}>
      {loading && <Loader/>}
    <div style={{ margin: "2rem" }}>
      <main className="roadmap-main-container">
        <h3 className="menu-head">Developer Roadmap</h3>
        <div className="desc">
        Below you find a set of charts demonstrating the paths that you can take and the technologies that you would want to adopt in order to become a frontend, backend or a devops. I made these charts for an old professor of mine who wanted something to share with his college students to give them a perspective; sharing them here to help the community.
        </div>
        <div style={{ marginBottom: "4rem" }}></div>
        {avRoadmaps.map((roadmap) => {
          return (
            <div className="roadmap-card-container">
              <RoadmapCard {...roadmap} />
            </div>
          );
        })}
      </main>
    </div>
    </Suspense>
  );
};
export default Roadmap;
