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
    return `rgb(${r}, ${g}, ${b})`;
};
//When inspecting the object correctCall in the console, it's possible to see that the rgb function is actually inside the
//prototype, not the instance of the object itself (only the properties are unique to each instance)

//-----CLASS SYNTAX ------------------------------------------------------------------------------------------------------------
//no need to have constructor and other methods created for the prototype separated from each other
//although it does the same thing at the end of the day, the code is more organized when using class syntax
class ColorClass {
    //constructor keyword is mandatory
    //it indicates a function that runs immediately when a new object for that class is instantiated
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    //now all other methods can be added inside of the class as following
    rgb(){
        const {r,g,b} = this;
        return `rgb(${r}, ${g}, ${b})`;
    }
}

//instantiating a new object using the template of the class ColorClass
const anotherColor = new ColorClass();
//calling a method in the new object and storing the value returned from taht method to a variable
const rgbString = anotherColor.rgb();

//Same as with correctCall, when calling anotherColor in the console, it's possible to see that the rgb function is actually
//inside the prototype, not the instance of the object itself (only the properties are unique to each instance)

//-----INHERITANCE : EXTENDS, SUPER AND SUBCLASSES ----------------------------------------------------------------------------
//just examples to focus on the concepts
//one class that has properties and methods that can be shared through multiple subclasses -> superclass
class Pet {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    eat(){
        return `${this.name} is eating`;
    }
}

//classes that extend from other class -> subclasses
class Cat extends Pet {
    //if I want to add more properties for Cat on top of the ones from Pet
    constructor(name, age, livesLeft = 9){
        //use keyword super to refer to the constructor of the superclass
        super(name, age);
        this.livesLeft = livesLeft;
    }

    meow(){
        return 'MEOOOOOOW!!!';
    }
}

class Dog extends Pet {
    bark(){
        return 'WOOOF!!!';
    }

    eat(){
        return `OMG! ${this.name} is eating!!!`
    }
}

//When either a Dog or Cat object is instantiated, it will not only apply the template with methods and properties pertained to
//its own Dog or Cat class, but it will also inherit all the properties and methods from Pet, including the constructor when 
//the class doesn't have one of its own (as the Dog class)
const cat1 = new Cat('Tom', 7, 8);
const dog1 = new Dog('Thor', 10);

//cat1 will have name: 'Tom' and age: 7 as properties, and it will be able to access the eat() method from the superclass 
//and the meow() method from the subclass
console.log(cat1.eat());
console.log(`${cat1.name} says ${cat1.meow()}`);

//dog1 will have name: 'Thor' and age: 10 as properties, and it would also be able to access the eat() method from the superclass,
//but since it already has its own eat() method, the one declared in the subclass overrides the one in the superclass 
console.log(dog1.eat()); //it will run the eat() method from Dog class
console.log(`${dog1.name} says ${dog1.bark()}`);
