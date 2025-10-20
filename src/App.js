import React, { useState } from 'react';
import FormularioEjercicio from './FormularioEjercicio';
import ConsultaEjercicios from './ConsultaEjercicios';

function App() {
  const [vista, setVista] = useState('formulario');

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => setVista('formulario')}>Añadir ejercicio</button>
      <button onClick={() => setVista('consulta')} style={{ marginLeft: '1rem' }}>Consultar ejercicios</button>

      <hr />

      {vista === 'formulario' ? <FormularioEjercicio /> : <ConsultaEjercicios />}
    </div>
  );
}

export default App;

