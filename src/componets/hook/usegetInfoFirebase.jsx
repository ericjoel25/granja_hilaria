import firebase from "../firebase/firebase";
import { getFirestore, collection, getDocs, orderBy, query, limit, addDoc, deleteDoc, doc, startAfter, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { useState } from "react";

const db = getFirestore(firebase);
const auth = getAuth(firebase);


export function useGetInfoFirebase(){
  
const [generalData, setGeneralData]= useState([]);
const [generalSearchData, setGeneralSearchData] = useState([])
const [startFormData, setStartFormData] = useState();


/** getFirebaseInfo is a function to get 
 *information from firebase but we need to provid the 'collectionName'.
 * 
 **/
async function getFirebaseInfo(collectionName) {

    const colRef = query(collection(db, collectionName), orderBy('startAt', 'desc'), limit(25))
        
    let info = []
           
    await getDocs(colRef).then((response)=>{
    
        setStartFormData(response.docs[response.docs.length -1]);
    
            response.forEach((doc) => {
                    
                const resolution = doc.data();
                resolution.id = doc.id
                    
                 info.push(resolution)
        
                });
    
            })
            
         setGeneralData(info)   

       return info
}

async function getMoreInfoFirebase({collectionName, alertNoInfo}) {
      
  const limitData = 25;
  const listData2 = [];

  const colletionRef  = query(collection(db, collectionName), orderBy('startAt', 'desc'), startAfter(startFormData.data().startAt), limit(limitData))

  await getDocs(colletionRef).then((response)=>{


    if (response.docs.length > 0) {

        setStartFormData(response.docs[response.docs.length - 1]);

    } else {

       alertNoInfo();
      
    }

    response.forEach((doc) => {

      const formDataInformation = doc.data();
      formDataInformation.id = doc.id;

      listData2.push(formDataInformation);
    });

    setGeneralData([...generalData, ...listData2]);

  })
  
  console.log(listData2)
  return listData2; 
   
}

async function saveInfoToFirebase(collectionName, Info){
    
    let id = ''; 

    await addDoc(collection(db, collectionName), Info )
    .then((data)=> {
        console.log(data.id)
        setGeneralData([{...Info, id:data.id}, ...generalData])
        id = data.id; 
    })

    return id; 
}


const removeInfoFromFirebase = async ({collectionName, id, data}) => {

     
    let dataWithoutItem= []; 

    const collectionRef = doc(db, collectionName, id )
   
    await deleteDoc(collectionRef).then(()=>{
 
       const removeLocal = data.filter((list, index)=>{
        let response= list.id !== id; 
     
         return response; 
      }) 
  
      dataWithoutItem = removeLocal; 
      //setGeneralData(removeLocal); 
  
      console.log('Delete');

 
    }).catch((e)=>{
 
      console.error(e)
 
    })

  
   return dataWithoutItem; 
 
 
}

const removeInfoFromSearch = async (collectionName, id) => {

    const collectionRef = doc(db, collectionName, id )
   
    await deleteDoc(collectionRef).then(()=>{
 
       // getFirebaseInfo(collectionName, 25)
        //getInforFromFirebase();
       // setShowDaleteModal(false);

       const removeLocal = generalSearchData.filter((list, index)=>{
        let response= list.id !== id; 
     
         return response; 
     }) 

     setGeneralSearchData(removeLocal); 

      console.log('Delete');
 
    }).catch((e)=>{
 
      console.error(e)
 
    })
 
 
}


async function searchInfoFirebase(collectionName, name, text, clearInput,  openSearchAlert){

    if(text){
       // const texto = '12'

        const q = query(collection(db, collectionName), where(`${name}`, "==", `${text}`));
        
        const  listaData = []
        await getDocs(q).then((response)=>{

            response.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
      
                const info = doc.data()
                info.id = doc.id

               listaData.push(info)

               clearInput()
              
           
               
              })
     
              setGeneralSearchData(listaData)
         
          if(response.size ===0){
            openSearchAlert();
          }
          
        })

       
}
    

}
    
    return{
        getFirebaseInfo,
        getMoreInfoFirebase,
        saveInfoToFirebase,
        searchInfoFirebase,
        removeInfoFromFirebase,
        removeInfoFromSearch,
        generalData,
        setGeneralData,
        generalSearchData,
        setGeneralSearchData
    }
}