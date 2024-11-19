import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { InputForm } from "./components/InputForm";
import { TunnelMap } from "./components/TunnelMap";

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="searchContainer">
        <TunnelMap />
        <InputForm />
      </div>
      <section className="aboutContainer">
        <h1>About</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit
          amet nisl molestie ante auctor sollicitudin id a mi. Nulla consequat
          tellus auctor, malesuada enim at, tincidunt justo. Ut volutpat at
          augue ac facilisis. Donec sed sapien neque. Aliquam tempus, nunc nec
          varius molestie, nisi tortor maximus nulla, vel bibendum neque nisl
          eget felis. In rutrum eros quis odio semper, ac sodales metus
          eleifend. Vivamus nec ante ut enim consequat cursus. Nunc ac posuere
          ipsum, nec bibendum velit. Sed scelerisque mollis commodo. Nam
          posuere, dolor sit amet mattis maximus, arcu orci varius tellus, eu
          maximus nisl felis vitae est. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Mauris ac
          convallis purus, quis molestie velit. Mauris mollis sem blandit magna
          blandit volutpat. Morbi euismod congue scelerisque. Ut nisl sem,
          gravida ac purus eget, pellentesque vulputate massa. Nam id orci in
          quam mattis ultricies vitae ac justo. In imperdiet urna vel ex
          pulvinar, eu tincidunt neque ultricies. Maecenas suscipit elementum
          quam. Ut ultrices libero quis tortor placerat, ac vehicula nisi
          luctus. Maecenas sit amet semper eros. Aenean sed elit ipsum.
          Vestibulum condimentum risus lorem, sed porta purus laoreet a.
          Curabitur quis velit ut nunc iaculis finibus gravida sit amet ipsum.
          Pellentesque sollicitudin eleifend justo, sit amet lacinia nibh
          laoreet ut. Quisque sed ornare nibh. Suspendisse dignissim justo id
          risus tempor auctor. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Nunc justo lectus, dapibus ac auctor at, sagittis a
          ex. Cras ullamcorper vehicula ornare. Phasellus fermentum faucibus
          velit, eget commodo diam mattis non. Donec mollis, leo aliquet feugiat
          tincidunt, elit arcu feugiat dolor, non porta lorem felis at odio. Sed
          a mi sodales, sodales orci in, ornare velit. Suspendisse nisl dolor,
          ultricies quis cursus nec, euismod id turpis. Vivamus dignissim massa
          nulla, a tempor erat mollis sed.
        </p>
      </section>
    </div>
  );
}

export default App;
