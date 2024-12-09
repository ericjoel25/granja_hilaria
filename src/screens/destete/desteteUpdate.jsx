import { useEffect, useState } from 'react';
import '../../componets/styles/desteteStyles/desteteModalInfo.css';
import firebase from '../../componets/firebase/firebase';
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import {Modal} from "../../componets/modal";
import { Instant } from '../../componets/Instant/Instant';


const db = getFirestore(firebase);
const auth = getAuth(firebase);



/**
 * 
 * @param {visible} props  provide the props visible={boalean}
 * @returns Open the modal with the form to set the information.
 */

export default function DesteteUpdate(props) {

    const {format, add_days}=Instant(); 
    const collectionName = `Destete-${auth.currentUser.uid}`;
    const {visible, id, showUpdate, setShowUpdate, generalData, setGeneralData } = props;
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        NoDeLaMadre: '',
        NoDeLechones: '',
        Hembras: '',
        Machos: '',
        FechaDeNacimiento: '',
        Hierrro1ra: '',
        Hierrro2da: '',
        SuplementosIniciar: '',
        ListosParaVenta: '',
        Hoy: new Date(),
        startAt: new Date().getTime()

    })



    useEffect(() => {

        CustomerInfo()

    }, [showUpdate])



    const text = '¡Por favor complete el formulario! 😅';


    const handelTextChange = (value, name) => {
        setFormData({ ...formData, [name]: value.target.value })

    }


    const CustomerInfo = async () => {

        //const collectionRef = doc(db, collectionName, id)
        // const document = await getDoc(collectionRef)
        // const Información = await document.data()

        const Información = generalData.filter((list, index) => {
            let response = list.id === id;

            return response;
        })

        setFormData(...Información);

    }



    const submit = async () => {

        let errors = {};

        const Info = {
            NoDeLaMadre: formData.NoDeLaMadre,
            NoDeLechones: formData.NoDeLechones,
            Hembras: formData.Hembras,
            Machos: (formData.NoDeLechones - formData.Hembras),
            FechaDeNacimiento: format(add_days(formData.FechaDeNacimiento, 1)),
            Hierrro1ra: format(add_days(formData.FechaDeNacimiento, 8)),
            Hierrro2da: format(add_days(formData.FechaDeNacimiento, 15)),
            SuplementosIniciar: format(add_days(formData.FechaDeNacimiento, 8)),
            ListosParaVenta: format(add_days(formData.FechaDeNacimiento, 56)),
            id:formData.id,
            Hoy: formData.Hoy,
            startAt: new Date()
        }

        if (!formData.NoDeLaMadre.trim() || !formData.NoDeLechones.trim() || !formData.Hembras.trim() || !formData.FechaDeNacimiento.trim()
        ) {

            if (!formData.NoDeLaMadre) errors.NoDeLaMadre = true;
            if (!formData.NoDeLechones) errors.NoDeLechones = true;
            if (!formData.Hembras) errors.Hembras = true;
            if (!formData.FechaDeNacimiento) errors.FechaDeNacimiento = true;

            setOpenModal(true)


            return;
        }

        try {

            const collectionRef = doc(db, collectionName, id)
            await updateDoc(collectionRef, Info).then(() => {

                //setData([Info, ...data])

                const Información = generalData.filter((list, index) => {
                    let response = list.id !== id;

                    return response;
                })


                setGeneralData([Info, ...Información]);
                //getFirebaseInfo(collectionName);
            })

        } catch (error) {

            console.error("Error adding document: ", error)
        }

        setFormData({
            NoDeLaMadre: '',
            NoDeLechones: '',
            Hembras: '',
            Machos: '',
            FechaDeNacimiento: '',
            Hierrro1ra: '',
            Hierrro2da: '',
            SuplementosIniciar: '',
            ListosParaVenta: '',
            Hoy: new Date(),
            startAt: new Date().getTime()

        })

        setShowUpdate(showUpdate => !showUpdate)


    }



    return (
        <>
          {visible?(
              <div className="D_modal_container">
              <div className="D_modal_body animate">
  
                  <form className="D_modal_form">
  
                      <label className="D_modal_label">N. de la madre:</label>
                      <input className="D_modal_input" placeholder="No. de la madre" type={'text'} value={formData?.NoDeLaMadre ||''} onChange={(value) => handelTextChange(value, 'NoDeLaMadre')} />
  
                      <label className="D_modal_label">N. de lechones:</label>
                      <input className="D_modal_input" placeholder="N. de lechones" type={'number'} value={formData?.NoDeLechones ||''} onChange={(value) => handelTextChange(value, 'NoDeLechones')} />
  
                      <label className="D_modal_label">Hembras:</label>
                      <input className="D_modal_input" placeholder="Hembras" type={'number'} value={formData?.Hembras ||''} onChange={(value) => handelTextChange(value, 'Hembras')} />
  
                      <label className="D_modal_label">Machos:</label>
                      <input className="D_modal_input" placeholder="Machos" type={'text'} value={(formData?.NoDeLechones - formData?.Hembras)||0 } onChange={(value) => handelTextChange(value, 'Machos')} />
  
  
                      <label className="D_modal_label">Fecha de nacimiento:</label>
                      <input className="D_modal_input" type={'date'} value={formData?.FechaDeNacimiento||''} onChange={(value) => handelTextChange(value, 'FechaDeNacimiento') ||''} />
  
                      <label className="D_modal_label">Hierrro 1ra:</label>
                        <input className="D_modal_input"   type={'text'} value={format(add_days(formData?.FechaDeNacimiento, 8), 'Hierro 1ra')}  onChange={(value)=> handelTextChange(value, 'Hierrro1ra')}  />
     
                        <label className="D_modal_label">Hierrro 2da:</label>
                        <input className="D_modal_input"   type={'text'} value={format(add_days(formData?.FechaDeNacimiento, 15), 'Hierro 2da')}  onChange={(value)=> handelTextChange(value, 'Hierrro2da')}/>
     
                        <label className="D_modal_label">Suplementos iniciar:</label>
                        <input className="D_modal_input"  type={'text'} value={format(add_days(formData?.FechaDeNacimiento, 8), 'Suplementos iniciar')} onChange={(value)=> handelTextChange(value, 'SuplementosIniciar')} />
                       
                        <label className="D_modal_label">Listos para venta:</label>
                        <input className="D_modal_input"  type={'text'}  value={format(add_days(formData?.FechaDeNacimiento, 46), 'Listos para venta')} onChange={(value)=> handelTextChange(value, 'ListosParaVenta')} />
                  </form>
  
                  <section className="D_modal_btn_body">
                      <button className="D_modal_btn" onClick={() => setShowUpdate(showUpdate => !showUpdate)}>Cancelar</button>
                      <button className="D_modal_btn" onClick={() => submit()} >Guardar</button>
                  </section>
              </div>
  
               <Modal 
                 visible={openModal}
                 title={text} 
                 button1={'Ok'} 
                 fnButton1={() => setOpenModal(false)} /> 
              
          
          </div>
          ):(<></>)

          }
        </>
        
    )
}