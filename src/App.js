import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css';

export default function App() {

  const { id, jwt } = useParams();
  const navigate = useNavigate();

  const [ price, setPrice ] = useState(null);
  const [ qrCode, setQrCode ] = useState(null);
  const [ logo, setLogo ] = useState(null);
  const [ backgroundColor, setBackgroundColor ] = useState(null);
  const [ userData, setUserData ] = useState(null);
  const [ payed, setPayed ] = useState(null);


  useEffect(() => {
    const fetchData = () => {
      // Decode jwt
      const decodedToken = jwt_decode(jwt);

      // Fetch first API
      axios.get(`https://node.clubecerto.com.br/superapp/pay/payment/status/${ id }`, { headers: { Authorization: `Bearer ${ jwt }` } })
        .then((response) => {
          // Update states first
          setPrice(response.data.value);
          setQrCode(response.data.qrCode);
          setPayed(response.data.paidAt)

          // Convert string to Date
          const expireAt = new Date(response.data.expireAt);
          const now = new Date();

          // If qrcode is expired
          if (now > expireAt) {
            navigate("/expired");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      setLogo(decodedToken.selectedCompany.companiesImage.image);
      setBackgroundColor(decodedToken.selectedCompany.companiesColor.backgroundColor);
      setUserData(decodedToken);
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (payed === 'paid') {
      if (window.confirm('Pagamento realizado com sucesso! Você será redirecionado.')) {
        window.location.href = 'https://clubecerto.com.br/';
      }
    }
    if (payed === 'waiting') {
      window.alert('Aguarde, seu pagamento está sendo processado...');
    }

  }, [ payed ]);


  const copyCode = async (token) => {
    try {
      await navigator.clipboard.writeText(token);
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
      <div className="qr-section">
        { qrCode ? (
          <QRCode
            className='qr-code'
            value={ qrCode }
            viewBox={ `0 0 256 256` }
          />
        ) : (
          <p>Loading...</p>
        ) }
        <p className="qr-value">R$ { price }</p>
        <p className="small-text">Se preferir, você pode pagá-lo copiando e colando o código abaixo:</p>
        <p className="copy-paste-code">{ qrCode }</p>
        <button className="copy-btn" onClick={ () => copyCode(qrCode) }>Copiar código</button>
        <ToastContainer></ToastContainer>
      </div>
      <h1 style={ { textAlign: 'center', marginTop: '2rem' } }>Not Found</h1>
    </div>
  );
}
