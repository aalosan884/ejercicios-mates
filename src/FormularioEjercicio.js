import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

function FormularioEjercicio() {
  const [formulario, setFormulario] = useState({
    curso: '',
    materia: '',
    tema: '',
    contenido: '',
    enunciado: '',
    solucion: '',
    peVAU: false,
    comunidad_autonoma: '',
    año: '',
    convocatoria: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarEjercicio = async () => {
    const { error } = await supabase.from('ejercicios').insert([formulario]);
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('Ejercicio guardado correctamente');
      setFormulario({
        curso: '',
        materia: '',
        tema: '',
        contenido: '',
        enunciado: '',
        solucion: '',
        peVAU: false,
        comunidad_autonoma: '',
        año: '',
        convocatoria: ''
      });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Añadir ejercicio</h2>

      <label>Curso:
        <select name="curso" value={formulario.curso} onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="1º ESO">1º ESO</option>
          <option value="2º ESO">2º ESO</option>
          <option value="3º ESO">3º ESO</option>
          <option value="4º ESO">4º ESO</option>
          <option value="1º Bachillerato">1º Bachillerato</option>
          <option value="2º Bachillerato">2º Bachillerato</option>
        </select>
      </label>

      <label style={{ marginLeft: '1rem' }}>Materia:
        <select name="materia" value={formulario.materia} onChange={handleChange}>
          <option value="">Selecciona</option>
          <option value="Matemáticas ESO">Matemáticas ESO</option>
          <option value="Matemáticas A">Matemáticas A</option>
          <option value="Matemáticas B">Matemáticas B</option>
          <option value="Matemáticas Aplicadas a las Ciencias Sociales 1">Matemáticas Aplicadas a las Ciencias Sociales 1</option>
          <option value="Matemáticas 1">Matemáticas 1</option>
          <option value="Matemáticas Aplicadas a las Ciencias Sociales 2">Matemáticas Aplicadas a las Ciencias Sociales 2</option>
          <option value="Matemáticas 2">Matemáticas 2</option>
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <label>Tema: <input name="tema" value={formulario.tema} onChange={handleChange} /></label>
        <label style={{ marginLeft: '1rem' }}>Contenido: <input name="contenido" value={formulario.contenido} onChange={handleChange} /></label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Enunciado (LaTeX):<br />
          <textarea name="enunciado" value={formulario.enunciado} onChange={handleChange} rows={3} style={{ width: '100%' }} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Solución (LaTeX):<br />
          <textarea name="solucion" value={formulario.solucion} onChange={handleChange} rows={3} style={{ width: '100%' }} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          <input type="checkbox" name="peVAU" checked={formulario.peVAU} onChange={handleChange} />
          Ejercicio de PeVAU
        </label>
      </div>

      {formulario.peVAU && (
        <div style={{ marginTop: '1rem' }}>
          <label>Comunidad Autónoma: <input name="comunidad_autonoma" value={formulario.comunidad_autonoma} onChange={handleChange} /></label>
          <label style={{ marginLeft: '1rem' }}>Año: <input name="año" value={formulario.año} onChange={handleChange} /></label>
          <label style={{ marginLeft: '1rem' }}>Convocatoria: <input name="convocatoria" value={formulario.convocatoria} onChange={handleChange} /></label>
        </div>
      )}

      <button onClick={guardarEjercicio} style={{ marginTop: '1rem' }}>Guardar ejercicio</button>
    </div>
  );
}

export default FormularioEjercicio;
