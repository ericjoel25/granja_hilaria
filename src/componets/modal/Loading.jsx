import {loadingStyle} from '../../styles';



/**  You need to have a state with this    const [showLoading, setShowLoading]= useState(true); 
 *  And pass visible={showLoading}
 */
export function Loading({ visible }) {
    return (
        <>  
          {visible ? (
                <main className={loadingStyle.loading_container}>
                    <div className={loadingStyle.loader}></div>
                    <p className={loadingStyle.loader_text}>Cargando datos...</p>
                </main>
            ) : (<></>)}
        </>



    )
}