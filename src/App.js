import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import './App.css';
import { getTimeDiffInMinutes } from './helpers/cronometer';

export default function App() {

  const { id, jwt } = useParams();
  const navigate = useNavigate();

  const [ price, setPrice ] = useState(null);
  const [ qrCode, setQrCode ] = useState(null);
  const [ logo, setLogo ] = useState(null);
  const [ backgroundColor, setBackgroundColor ] = useState(null);
  const [ userData, setUserData ] = useState(null);
  const [ payed, setPayed ] = useState(null);
  const [ expireTimeInMinutes, setExpireTimeInMinutes ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ intervalId, setIntervalId ] = useState(null);

  const fetchData = () => {
    if (payed === 'paid' || payed === 'expired') {
      if (intervalId) clearInterval(intervalId);
      return;
    }
    if (loading) return;
    setLoading(true);

    // Decode jwt
    const decodedToken = jwt_decode(jwt);

    // Fetch first API
    // Fetch first API
    axios.get(`https://node.clubecerto.com.br/superapp/pay/payment/status/${ id }`, { headers: { Authorization: `Bearer ${ jwt }` } })
      .then((response) => {
        // Update states first
        setPrice(response.data.value);
        setQrCode(response.data.qrCode);
        setPayed(response.data.status);

        // Convert string to Date
        const expireAt = new Date(response.data.expireAt);
        const now = new Date();

        // If qrcode is expired
        if (now > expireAt) {
          navigate("/expired");
        }

        // Setting user data here
        setUserData({ ...decodedToken, expireAt: expireAt });

        // Calculate and set expire time in minutes here
        const remainingTime = getTimeDiffInMinutes({ date: expireAt });
        setExpireTimeInMinutes(remainingTime);

      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });


    setLogo(decodedToken.selectedCompany.companiesImage.image);
    setBackgroundColor(decodedToken.selectedCompany.companiesColor.backgroundColor);
  };


  const redirectUser = () => {
    let url;

    if (navigator.userAgent.match(/Android/i)) {
      url = 'https://play.google.com/store/apps/details?id=com.devusama.clubecerto';  // Sua URL da Play Store
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      url = 'https://apps.apple.com/br/app/clube-certo/id1662239139';  // Sua URL da Apple Store
    } else {
      url = 'https://play.google.com/store/apps/details?id=com.devusama.clubecerto';  // Sua URL da Play Store na Web
    }

    window.location.href = url;
  };

  useEffect(() => {
    if (payed === 'paid') {
      if (window.confirm('Pagamento realizado com sucesso! Você será redirecionado.')) {
        redirectUser();
      }
    }
    if (payed === 'expired') {
      navigate('/expired')
    }
  }, [ payed ]);


  useEffect(() => {
    const id = setInterval(() => {
      fetchData();
    }, 5000);
    fetchData();
    setIntervalId(id);

    // Certifique-se de limpar o intervalo quando o componente for desmontado
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (userData && userData.expireAt) {
        const remainingTime = getTimeDiffInMinutes({ date: userData.expireAt });

        setExpireTimeInMinutes(remainingTime);
      }
    }, 60 * 1000); // Atualiza a cada 1 minuto

    return () => clearInterval(id);
  }, [ userData ]);


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
          <p>Carregando...</p>
        ) }
        <p className="qr-value">R$ { price }</p>
        <p className="small-text">Se preferir, você pode pagá-lo copiando e colando o código abaixo:</p>
        <p className="copy-paste-code">{ qrCode }</p>

        <button className="copy-btn" onClick={ () => copyCode(qrCode) }>Copiar código</button>
        <div style={ { marginTop: '-2vh', marginBottom: '2vh', fontFamily: 'roboto', fontSize: '5vw' } }>
          Expira em { expireTimeInMinutes } min
        </div>
        <ToastContainer></ToastContainer>
      </div>
      <h1 style={ { textAlign: 'center', marginTop: '2rem' } }>Not Found</h1>
    </div>
  );
}
