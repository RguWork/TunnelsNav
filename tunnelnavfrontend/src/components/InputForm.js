import React, { useEffect, useRef, useState, useReducer } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import "./InputForm.css";

export const InputForm = () => {
  const startRef = useRef(null); //useRef to keep track of startLocation rendering
  //note that the form isnt rendered initially because it relies on the state showForm, which is by default false.
  //so we have to use useRef to only addEventListeners when the form is rendered

  const initialState = {
    isExpanded: false,
    isUploaded: false,
    showIcon: false,
    placeholderText: "Please type your starting location or attach an image",
    imageLink: null,
  };

  const reducer = (prevState, action) => {
    switch (action.type) {
      case "UPLOAD_IMAGE":
        // for when an image is uploaded. will show image and cross, hide the plus icon. will cause the box to stay expanded.
        return {
          ...prevState,
          isExpanded: true,
          isUploaded: true,
          showIcon: false,
          placeholderText: "",
          imageLink: action.payload,
        };
      case "EXPAND":
        // for when an image is hovered. will show the plus icon and hide the placeholder text.
        return {
          ...prevState,
          isExpanded: true,
          showIcon: true,
          placeholderText: "",
        };
      case "RESET":
        return initialState;
      default:
        return prevState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // write a listener for hovering and for dropping for the startLocation
  //make the inputfield transform visually as well when we hover with an image
  //if an image is dropped, after processed, make it display the image, with an option to remove it
  //so basically, if image stored, stay transformed. otherwise, transform back to text box.
  useEffect(() => {
    const startLocation = startRef.current; //check if form is rendered

    //define event handlers
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy"; //changes cursor when dragged over to a plus icon

      if (!state.isExpanded) {
        console.log('trying to expand here');
        dispatch({ type: "EXPAND" });
        // startLocation.classList.add('expanded') //toggles expanded subclass of input
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (state.isExpanded) {
        dispatch({ type: "RESET" });
      }
    };

    const handleDrop = (e) => {
      // if file is image, just store it in the form. make a way to display the image in the form, and add a button that lets the person
      // delete the image from input if they want. also make sure that when there is a stored value, you cannot input anymore

      //otherwise, give an alert, saying that the input must be an image
      e.preventDefault();
      const file = e.dataTransfer.files[0]; //takes the first file of the drop

      if (!state.isUploaded) {
        if (file && file.type.startsWith("image/")) {
          //to add: create a temp url of the image: URL.createObjectURL(file)
          //then show a mini version of the image, placing it on the website using absolute location
          //and add a delete button (maybe on the right side of the search bar)
          //and disable further input (i think i can just change the logic of this if else statement, maybe with a state)

          //then cleanup the image url: URL.revokeObjectURL(imagePreview)

          //then, ask about form submission and how it works (text vs image)
          //also all the states seem redundant, is it redundant? then, how would gpt go about improving it?
          dispatch({
            type: "UPLOAD_IMAGE",
            payload: URL.createObjectURL(file),
          });
          console.log("Image uploaded:", file.name);
        } else {
          alert("Please input an image file!");
        }
      }
    };

    const handleText = (e) => {
      console.log("text input detected");
      //add later behavior here
    };

    if (startLocation) {
      //attach event handlers
      startLocation.addEventListener("dragover", handleDragOver);
      startLocation.addEventListener("dragleave", handleDragLeave);
      startLocation.addEventListener("drop", handleDrop);
      startLocation.addEventListener("input", handleText);
    }

    //clean up event handlers
    return () => {
      if (startLocation) {
        startLocation.removeEventListener("dragover", handleDragOver);
        startLocation.removeEventListener("dragleave", handleDragLeave);
        startLocation.removeEventListener("drop", handleDrop);
        startLocation.removeEventListener("input", handleText);
      }
    };
  }, [state.isExpanded, state.isUploaded]);

  return (
    <div className="formContainer">
      <form>
        <h1>Choose your starting point and destination</h1>

        <div ref={startRef} className={`inputContainer ${state.isExpanded ? "expanded" : ""}`}> 
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            className="startLocation"
            placeholder={state.placeholderText}
          />
          <BiAddToQueue
            className={`inputIcon ${state.showIcon ? "show" : ""}`}
          />
          <img
            className={` ${state.isUploaded ? "imageIcon" : "hidden"}`}
            src={state.imageLink}
            alt="uploaded file preview"
          />
          <button
            type="button"
            className={`${state.isUploaded ? "crossButton" : "hidden"}`}
            onClick={() => dispatch({ type: "RESET" })}
          >
            {" "}
            <RxCross2 style={{ fontSize: "20px" }} />{" "}
          </button>
        </div>
        <div className="inputContainer">
          <input
            type="text"
            name="destinationLocation"
            className="destinationLocation"
            placeholder="Please type your destination location"
          />
        </div>
        <button className="submitButton">Submit</button>
      </form>
    </div>
  );
};
