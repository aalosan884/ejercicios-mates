import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Conexión a Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

function App() {
  const [formData, setFormData] = useState({
    curso: '',
    materia: '',
    tema: '',
    contenido: '',
    peVAU: false,
    comunidad_autonoma: '',
    año: '',
    convocatoria: '',
    enunciado: '',
    solucion: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('ejercicios').insert([formData]);
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('Ejercicio guardado correctamente');
      setFormData({
        curso: '',
        materia: '',
        tema: '',
        contenido: '',
        peVAU: false,
        comunidad_autonoma: '',
        año: '',
        convocatoria: '',
        enunciado: '',
        solucion: ''
      });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>Nuevo ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <label>Curso:
          <select name="curso" value={formData.curso} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="1º ESO">1º ESO</option>
            <option value="2º ESO">2º ESO</option>
            <option value="3º ESO">3º ESO</option>
            <option value="4º ESO">4º ESO</option>
            <option value="1º Bachillerato">1º Bachillerato</option>
            <option value="2º Bachillerato">2º Bachillerato</option>
          </select>
        </label><br /><br />

        <label>Materia:
          <select name="materia" value={formData.materia} onChange={handleChange}>
            <option value="">Selecciona</option>
            <option value="Matemáticas ESO">Matemáticas ESO</option>
            <option value="Matemáticas A">Matemáticas A</option>
            <option value="Matemáticas B">Matemáticas B</option>
            <option value="Matemáticas Aplicadas a las Ciencias Sociales 1">Matemáticas Aplicadas a las Ciencias Sociales 1</option>
            <option value="Matemáticas 1">Matemáticas 1</option>
            <option value="Matemáticas Aplicadas a las Ciencias Sociales 2">Matemáticas Aplicadas a las Ciencias Sociales 2</option>
            <option value="Matemáticas 2">Matemáticas 2</option>
          </select>
        </label><br /><br />

        <label>Tema: <input name="tema" value={formData.tema} onChange={handleChange} /></label><br /><br />
        <label>Contenido: <input name="contenido" value={formData.contenido} onChange={handleChange} /></label><br /><br />

        <label>¿PeVAU? <input type="checkbox" name="peVAU" checked={formData.peVAU} onChange={handleChange} /></label><br /><br />

        {formData.peVAU && (
          <>
            <label>Comunidad Autónoma:
              <select name="comunidad_autonoma" value={formData.comunidad_autonoma} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="Andalucía">Andalucía</option>
                <option value="Madrid">Madrid</option>
                <option value="Cataluña">Cataluña</option>
              </select>
            </label><br /><br />

            <label>Año: <input type="number" name="año" value={formData.año} onChange={handleChange} /></label><br /><br />
            <label>Convocatoria:
              <select name="convocatoria" value={formData.convocatoria} onChange={handleChange}>
                <option value="">Selecciona</option>
                <option value="Ordinaria">Ordinaria</option>
                <option value="Extraordinaria">Extraordinaria</option>
              </select>
            </label><br /><br />
          </>
        )}

        <label>Enunciado (LaTeX):<br />
          <textarea name="enunciado" value={formData.enunciado} onChange={handleChange} rows="5" cols="60" />
        </label><br /><br />

        <label>Solución (LaTeX, opcional):<br />
          <textarea name="solucion" value={formData.solucion} onChange={handleChange} rows="5" cols="60" />
        </label><br /><br />

        <button type="submit">Guardar ejercicio</button>
      </form>

      <h3>Vista previa del enunciado</h3>
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <BlockMath math={formData.enunciado} />
      </div>

      {formData.solucion && (
        <>
          <h3>Vista previa de la solución</h3>
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <BlockMath math={formData.solucion} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
