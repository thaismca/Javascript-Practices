//Factory function approach
//A function created to receive parameters and create an object
function makeColor(r,g,b){
    //create the object with a declaration
    const color = {}
    //use the parameters to populate the object properties
    color.r = r;
    color.g = g;
    color.b = b;

    //create functions to this object
    color.rgb = (r,g,b) => {
        const {r,g,b} = this;
        return `rgb(${r}, ${g}, ${b})`
    }
}

//whenever we want to create a new object coloar, we can use makeColor to use that color "template"
//passing the parameters that would correspond to r, g and b respectively.
const firstColor = makeColor(234,120,90);
firstColor.rgb(); // using this method would execute rgb() passing the firstColor r, g and b properties (234,120,90)

//factory functions are not the best approach!!!