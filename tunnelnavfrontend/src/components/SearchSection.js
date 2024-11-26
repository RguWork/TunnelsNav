import React, { useState } from "react";
import "./SearchSection.css";
import { TunnelMap } from "./TunnelMap";
import { InputForm } from "./InputForm";

export const SearchSection = () => {
  const [showForm, setShowForm] = useState(false);


//   idea: create two objects: 1 intro 1 form. intro is centered on screen, form is off screen. when anchor, do two simultaneous transitions

  return (
    <div className="searchContainer">
        <div className={`introWrapper ${showForm ? "left-screen" : "on-screen"}`}>
            <h1>Title</h1>
            <p>
              Some text Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Etiam sit amet nisl molestie ante auctor sollicitudin id a mi.
              Nulla consequat tellus auctor, malesuada enim at, tincidunt justo.
              Ut volutpat at augue ac facilisis. Donec sed sapien neque. Aliquam
              tempus, nunc nec varius molestie, nisi tortor maximus nulla, vel
              bibendum neque nisl eget felis. In rutrum eros quis odio semper,
              ac sodales metus eleifend. Vivamus nec ante ut enim consequat
              cursus. Nunc ac posuere ipsum, nec bibendum velit. Sed scelerisque
              mollis commodo.
            </p>
            <a onClick={() => setShowForm(true)}>Link to search<i className="arrow right"></i></a>
          </div>

          <div className={`formWrapper ${showForm ? "on-screen" : "right-screen"}`}>
            <div className="miniFormWrapper">
                <div className="mapContainer">
                  <TunnelMap />
                </div>
                <InputForm />

            </div>
            <a onClick={() => setShowForm(false)}><i class="arrow left"></i>Back</a>
          </div>

    </div>
  );
};
