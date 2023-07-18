import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import './App.css'; // Importar o arquivo CSS

export default function App() {
  const { id, qrcode, } = useParams();

  const [ logo, setLogo ] = useState(null);
  const [ backgroundColor, setBackgroundColor ] = useState(null);
  const [ price, setPrice ] = useState(null);
  const [ token, setToken ] = useState(null);

  useEffect(() => {
    axios.get(``)
      .then((response) => {
        const { value, qrcodeData } = response.data;

        setPrice(value);
        setToken(qrcodeData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  useEffect(() => {
    axios.get(`https://node.clubecerto.com.br/superapp/locations/company/${ id }`)
      .then((response) => {
        const { image, backgroundColor } = response.data;
        setLogo(image);
        setBackgroundColor(backgroundColor);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ id ]);


  const copyCode = async (token) => {
    try {
      await
        navigator.clipboard.writeText(token);

      toast.success("Código Copiado!", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (

    <div className="main">
      <div className="header" style={ { backgroundColor: backgroundColor } }>
        <div className='image-container'>
          <img src={ logo } alt="Logo" className="logo" />
        </div>
        <p className="instruction">
          Falta pouco! Escaneie o código QR pelo seu app de pagamentos ou Internet Banking
        </p>
      </div>

      { price && qrcode && token ? (
        <div className="qr-section">
          <QRCode
            className='qr-code'
            value={ qrcode }
            viewBox={ `0 0 256 256` }
          />
          <p className="qr-value">R$ { price }</p>
          <p className="small-text">Se preferir, você pode pagá-lo copiando e colando o código abaixo:</p>
          <p className="copy-paste-code">{ token }</p>
          <button className="copy-btn" onClick={ () => copyCode(token) }>Copiar código</button>
          <ToastContainer></ToastContainer>
        </div>
      ) : (
        <h1 style={ { textAlign: 'center', marginTop: '2rem' } }>Not Found</h1>
      ) }
    </div>
  );
}
