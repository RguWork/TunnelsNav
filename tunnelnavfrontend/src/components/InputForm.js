import React, {useEffect, useRef} from "react";
import "./InputForm.css";

export const InputForm = () => {

    // useEffect(() => {
    //     console.log("is it rendered?", document.getElementById("inputFormId")); 
    // from this test we can see that the input is not rendered initially. this is because of conditional rendering:
    // in searchsection, the form only renders when showForm is true, which is when we clikc the initial anchor
    // thus, the form is not rendered by default.
    //   }, []);

    //interesting error that requires the following code:
    //when the webpage is loaded, the inputform isnt rendered until i press the link to search anchor
    //so initially, getElementById will get a null object. then trying to use addEventListener on a null object raises an error.
    //to solve this, we use the hook useRef: this makes it so that it tracks the startLocation input, and whether it has rendered or not
    //when its rendered, then we can do stuff with it
    const startRef = useRef(null); //useRef to keep track of startLocation rendering

      

    // write a listener for hovering and for dropping for the startLocation
    //make the inputfield transform visually as well when we hover with an image
    //if an image is dropped, after processed, make it display the image, with an option to remove it
    //so basically, if image stored, stay transformed. otherwise, transform back to text box.
    useEffect(() => {
        const startLocation = startRef.current; //check if form is rendered

        //define event handlers
        const handleDragOver = (e) => {
            //TO DO: transform text box into image box looking input
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy'; //changes cursor when draged over?
        }

        const handleDrop = (e) => {
            // if file is image, just store it in the form. make a way to display the image in the form, and add a button that lets the person
            // delete the image from input if they want. also make sure that when there is a stored value, you cannot input anymore
    
            //otherwise, give an alert, saying that the input must be an image
            e.preventDefault();
            const file = e.dataTransfer.files[0]; //takes the first file of the drop
            if (file && file.type.startsWith('image/')){
                console.log("Image uploaded:", file.name);
                //add other shit here later
            } else {
                alert("Please input an image file!")
            }
        }
    
        const handleText = (e) => {
            console.log("text input detected")
            //add later behavior here
        }
    
        if (startLocation) {
            //attach event handlers
            startLocation.addEventListener('dragover', handleDragOver);
            startLocation.addEventListener('drop', handleDrop);
            startLocation.addEventListener('input', handleText);
        }

        //clean up event handlers
        return(() => {
            if (startLocation){
                startLocation.removeEventListener('dragover', handleDragOver);
                startLocation.removeEventListener('drop', handleDrop);
                startLocation.removeEventListener('input', handleText);

            }
        })
    }, []);


    

    return(
        <div className="formContainer"> 
            <form>
                <h1>Choose your starting point and destination</h1>
                <input type="text" ref={startRef} id="startLocation" name="startLocation" className="startLocation" placeholder="Please type your starting location or attach an image"/>
                <input type="text" name="destinationLocation" className="destinationLocation" placeholder="Please type your destination location or attach an image"/>
                <button>Submit</button>
            </form>
        </div>
    )
};