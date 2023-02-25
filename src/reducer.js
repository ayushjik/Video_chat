import { StateContext } from "./StateProvider";


// const getDataFromLs = () => {
//     const data = localStorage.getItem('items')
//     if (data){
//       return JSON.parse(data);
//     }else{
//       return 
      
//     }
//   }

export const initialState = {
    cart: [],
};

//Selector



const reducer = (state, action) => {
    
    switch(action.type) {
        case "ADD_TO_CART":
           
            
            return {
              
                basket: [ action.item],
                
            }
           
        
        default:
            return state;
    } 
}

export default reducer;