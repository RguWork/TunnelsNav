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
    startLocation: {text: "", image: null},
    destinationLocation: "",
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
      case "SET_START_TEXT":
        return {
          ...prevState,
          startLocation: {...prevState.startLocation, text: action.payload}
        };
      case "SET_START_IMAGE":
        return {
          ...prevState,
          startLocation: {...prevState.startLocation, image: action.payload}
        };
      case "SET_DESTINATION":
        return{
          ...prevState,
          destinationLocation: action.payload,
        };
      case "RESET":
          return initialState;
      case "PARTIAL_RESET":
        //this is literally for the drag leave behavior.
        //coded because to see if text exists when an image is dragged over to disable hover properties
        //it checks startLocation.text. but drag leave, when using reset, resets this value.
        //so if you dragleave twice it bugs.
          return {
            isExpanded: false,
            isUploaded: false,
            showIcon: false,
            placeholderText: "Please type your starting location or attach an image",
            imageLink: null,
            startLocation: {...prevState.startLocation, image: null},
            destinationLocation: prevState.destinationLocation,
          };
      default:
        return prevState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  //NOTE: get rid of this post testing
  useEffect(() => {
    console.log("state has been updated:", state.startLocation);
  }, [state.startLocation])

  //write a listener for hovering and for dropping for the startLocation
  //make the inputfield transform visually as well when we hover with an image
  //if an image is dropped, after processed, make it display the image, with an option to remove it
  //so basically, if image stored, stay transformed. otherwise, transform back to text box.
  
  useEffect(() => {
    const startLocation = startRef.current; //check if form is rendered

    //define event handlers
    const handleDragOver = (e) => {
      e.preventDefault();

      if (!state.isExpanded && state.startLocation.text === ""){
        e.dataTransfer.dropEffect = "copy"; //changes cursor when dragged over to a plus icon
        // console.log('trying to expand here'); NOTE: DELETE
        dispatch({ type: "EXPAND" });
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (state.isExpanded && !state.isUploaded) {
        dispatch({ type: "PARTIAL_RESET" });
      }
    };

    const handleDrop = (e) => {
      if (state.startLocation.text === ""){
        e.preventDefault();
        const file = e.dataTransfer.files[0]; //takes the first file of the drop

        if (file && file.type.startsWith("image/")){
          dispatch({
                  type: "UPLOAD_IMAGE",
                  payload: URL.createObjectURL(file),
                });
          dispatch({ type: "SET_START_IMAGE", payload: file})
          
        }else{
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
  }, [state.isExpanded, state.isUploaded, state.startLocation]);

  const handleStartChange = (e) => {
    if (e.target.value === ""){
      dispatch({ type: "SET_START_TEXT", payload: "" })
    }else{
      dispatch({ type: "SET_START_TEXT", payload: e.target.value })
    }
  }

  const callApi = async (e) => {
    try {
      const formData = new FormData();
      formData.append("startText", state.startLocation.text);
      formData.append("startImage", state.startLocation.image);
      formData.append("destinationText", state.destinationLocation);

      let response = await fetch("http://localhost:5000/api/pathfinding", {
        method: "POST", //specify method
        body: formData,
      })

      if (!response.ok){
        //if there is an issue with the response due to server issues
        const errorData = await response.json();
        console.log("Server Error:", errorData.error);
        return;
      }

      let data = await response.json()

      if (data.error){
        window.alert(`Error: ${data.error}`); //this is if the app.py returns an error, so like if a location doesnt exist, etc.
      }

      console.log(data)
    }catch(err){
      //if we dont even get a response
      console.log("Network Error:", err)
    }
      
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Start Location (before submit):", state.startLocation);
    // console.log("Destination Location (before submit):", state.destinationLocation);

    await callApi();
    console.log("Start Location (after submit):", state.startLocation);
    console.log("Destination Location (after submit):", state.destinationLocation);
  }

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h1>Choose your starting point and destination</h1>

        <div ref={startRef} className={`inputContainer ${state.isExpanded ? "expanded" : ""}`}> 
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            className="startLocation"
            placeholder={state.placeholderText}
            onChange={(e) => handleStartChange(e)}
            disabled={state.isUploaded}
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
            onClick={
              () => {
                dispatch({ type: "PARTIAL_RESET" });
              }
            }
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
            onChange={(e) => dispatch({ type:"SET_DESTINATION", payload: e.target.value })}
          />
        </div>
        <button className="submitButton" type="submit">Submit</button>
      </form>
    </div>
  );
};
