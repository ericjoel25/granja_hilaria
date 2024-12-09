import { useEffect, useState } from 'react';
import firebase from '../../componets/firebase/firebase';
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import {getAuth} from 'firebase/auth';
import {Modal} from '../../componets/modal'; 
import {gestacionCSS} from '../../styles'; 


const db = getFirestore(firebase);
const auth = getAuth(firebase); 

/**
 * 
 * @param {UpdateGestantion} props provid visible={boolean}.
 *  
 * @returns a modal to update the information.
 */

export default function UpdateGestation(props) {
   

    const {visible, id, showUpdate, setShowUpdate, generalData, setGeneralData } = props; 
    const collectionName = `Getation-${auth.currentUser.uid}`; 
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
       NoDelCerdo:'',
       Edad:'',
       NoCerda:'',
       NoParto:'',
       InicioDeGestación: '',
       FinDeGestación:'',
       NoDeLechones:'',
       Vivos:'',
       Muertos:'',
       id:'',
       Hoy:new Date(),
       startAt: new Date().getTime()

    })

 useEffect(()=>{

    CustomerInfo()
 
},[showUpdate])   



const text = '¡Por favor complete el formulario! 😅';
const No_muerto =formData?.NoDeLechones? formData?.NoDeLechones-formData?.Vivos:'';


const handelTextChange=(value, name)=>{
   setFormData({...formData, [name]:value.target.value})
  
}


const CustomerInfo = async () => {

    /*const collectionRef = doc(db, collectionName, id)

    const document = await getDoc(collectionRef)

    const Información = await document.data()

    setFormData({ ...Información, id: doc.id, });*/

    const Información = await generalData.filter((list, index)=>{
      let response= list.id === id; 
   
       return response; 
   }) 

   setFormData(...Información)




}




const submit= async ()=>{
   
  let errors = {};

  const Info= {
      NoDelCerdo: formData.NoDelCerdo,
      Edad: formData.Edad,
      NoCerda: formData.NoCerda,
      NoParto: formData.NoParto,
      InicioDeGestación:formData.InicioDeGestación,
      FinDeGestación:formData.FinDeGestación,
      NoDeLechones: formData.NoDeLechones ,
      Vivos:formData.Vivos,
      id:formData.id,
      Muertos: formData.NoDeLechones - formData.Vivos,
      Hoy:formData.InicioDeGestación,
      startAt:new Date()
   }


    if(!formData.NoDelCerdo.trim() || !formData.Edad.trim() || !formData.NoCerda.trim() || !formData.NoParto.trim() ||
      !formData.NoDeLechones.trim()       
     ){
      
      if(!formData.NoDelCerdo) errors.NoDelCerdo=true;
      if(!formData.Edad) errors.Edad =true;
      if(!formData.NoCerda) errors.NoCerda=true;
      if(!formData.NoParto) errors.NoParto=true;
      if(!formData.InicioDeGestación) errors.InicioDeGestación=true;
      if(!formData.FinDeGestación) errors.FinDeGestación=true;
      if(!formData.NoDeLechones) errors.NoDeLechones=true;
      if(!formData.Vivos) errors.Vivos=true;  
    
      setOpenModal(true)

      return;
     } 

      try {

         const collectionRef = doc(db, collectionName, id)
         await updateDoc(collectionRef, Info).then(()=> {

            const Información = generalData.filter((list, index)=>{
               let response= list.id !== id; 
            
                return response; 
            }) 
       
            
            setGeneralData([Info, ...Información])

           })

       } catch (error) {

          console.error("Error adding document: ", error)
       }

       setFormData({
        NoDelCerdo:'',
        Edad:'',
        NoCerda:'',
        NoParto:'',
        InicioDeGestación:'',
        FinDeGestación: '',
        NoDeLechones:'',
        Vivos:'',
        Muertos:'',
        Hoy: '',
        id:'',
        startAt:new Date()
    
      })
  
      setShowUpdate(showUpdate => !showUpdate)

 }



    return(

       <>
         {visible?(
             <div className={gestacionCSS.G_modal_container}>
             <div className={`${gestacionCSS.G_modal_body} ${gestacionCSS.animate}`}>
 
                <form className={gestacionCSS.G_modal_form}>
 
                    <label className={gestacionCSS.G_modal_label}>N. del cerdo:</label>
                    <input className={gestacionCSS.G_modal_input}  placeholder="N. del cerdo" type={'text'} value={formData?.NoDelCerdo || ''} onChange={(value)=> handelTextChange(value, 'NoDelCerdo')} />
                    
                    <label className={gestacionCSS.G_modal_label}>Edad:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="Edad"  type={'text'} value={formData?.Edad || ''} onChange={(value)=> handelTextChange(value, 'Edad')}/>
                    
                    <label className={gestacionCSS.G_modal_label}>No. cerda:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="No. cerda" type={'text'} value={formData?.NoCerda|| ''} onChange={(value)=> handelTextChange(value, 'NoCerda')}/>
                    
                    <label className={gestacionCSS.G_modal_label}>No. parto:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="No. parto" type={'text'} value={formData?.NoParto || ''} onChange={(value)=> handelTextChange(value, 'NoParto')}/>
                    
                    
                    <label className={gestacionCSS.G_modal_label}>Inicio de gestación:</label>
                    <label className={gestacionCSS.G_modal_input} >{formData?.InicioDeGestación || ''}</label>
 
                    <label className={gestacionCSS.G_modal_label}>Fin de gestación:</label>
                    <label className={gestacionCSS.G_modal_input} >{formData?.FinDeGestación || ''}</label>
                    
                    <label className={gestacionCSS.G_modal_label}>Numero de lechones:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="No. de lechones" type={'number'} value={formData?.NoDeLechones || ''} onChange={(value)=> handelTextChange(value, 'NoDeLechones')}/>
                    
                    <label className={gestacionCSS.G_modal_label}>Vivos:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="Vivos" type={'text'} value={formData?.Vivos || ''} onChange={(value)=> handelTextChange(value, 'Vivos')} />
                    
                    <label className={gestacionCSS.G_modal_label}>Muertos:</label>
                    <input className={gestacionCSS.G_modal_input} placeholder="Muerto" type={'text'} value={No_muerto || ''} onChange={(value)=> handelTextChange(value, 'Muertos')} />
                </form>
 
                <section className={gestacionCSS.G_modal_btn_body}>
                    <button  className={gestacionCSS.G_modal_btn} onClick={()=> setShowUpdate(showUpdate => !showUpdate)}>Cancelar</button>
                    <button className={gestacionCSS.G_modal_btn} onClick={()=>submit()} >Guardar</button>
                </section>
             </div>
            
             <Modal
                visible={openModal}
                title={text} 
                button1={'Ok'}  
                fnButton1={()=> setOpenModal(false)}
                
                />
 
         </div>
         ):(<></>)}
       
       </>
       
    )
}