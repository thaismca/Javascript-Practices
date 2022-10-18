//-----FACTORY FUNCTIONS APPROACH ------------------------------------------------------------------------------------------------
//A function created to receive parameters and create an object
function makeColor(r,g,b){
    //create the object with a declaration
    const color = {}
    //use the parameters to populate the object properties
    color.r = r;
    color.g = g;
    color.b = b;

    //create functions to this object
    color.rgb = function() {
        const {r,g,b} = this;
        return `rgb(${r}, ${g}, ${b})`
    }
    return color;
}

//whenever we want to create a new object coloar, we can use makeColor to use that color "template"
//passing the parameters that would correspond to r, g and b respectively.
const firstColor = makeColor(234,120,90);
firstColor.rgb(); // using this method would execute rgb() passing the firstColor r, g and b properties (234,120,90)

//factory functions are not the best approach!!!
//all functions are recreated and a unique copy is added to each color object, and there's no need for that
//with constructors, the functions are located in the prototype

//-----CONSTRUCTOR FUNCTION APPROACH -----------------------------------------------------------------------------------------------
//the function is declared and the parameters will used to populate the object properties when its instantiated
function Color(r, g, b) {
    //must use the keyword this
    this.r = r;
    this.g = g;
    this.b = b;
};

//calling the function as below won't work, since "this" won't refer to any object
//because the function is not being called inside of an object (it will refer to the window)
const wrongCall = Color(120, 34, 198); //console.log(wrongCall) will return undefined

//when working with a constructor to instantiate an object, it's necessary to use the keyword new
const correctCall = new Color(120, 34, 198); //console.log(wrongCall) will return the object

//Adding functions to the prototypes is done using the following syntax
Color.prototype.rgb = function() { //cannot use arrow functions because of how that would mess with the scope of "this"
    const {r,g,b} = this;
    return `rgb(${r}, ${g}, ${b})`
};
//When ispecting the object correctCall in the console, it's possible to see that the rgb function is actually inside the
//prototype, not the instance of the object itself (only the properties are unique to each instance)