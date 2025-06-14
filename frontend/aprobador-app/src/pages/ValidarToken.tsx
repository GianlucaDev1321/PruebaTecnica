import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { validarAcceso } from '../services/api';

const ValidarToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get('approver_token') || '';
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // precarga el token de la URL
  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleValidar = async () => {
    setError('');
    if (!token) {
      setError('Debe ingresar el token');
      return;
    }

    setLoading(true);
    try {
      const res = await validarAcceso(token);
      if (res?.solicitud && res?.aprobador) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('solicitud_id', res.solicitud.id);
        sessionStorage.setItem('solicitud', JSON.stringify(res.solicitud));
        sessionStorage.setItem('aprobador', JSON.stringify(res.aprobador));
        navigate('/approve/firmar');
      } else {
        setError('Token inválido o expirado');
      }
    } catch {
      setError('Error validando el token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🔐 Validar acceso</h2>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Ingrese el token"
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button
        onClick={handleValidar}
        disabled={loading}
        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px' }}
      >
        {loading ? 'Validando...' : 'Validar Token'}
      </button>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
};

export default ValidarToken;
