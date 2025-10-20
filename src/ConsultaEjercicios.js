import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Conexión a Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

function ConsultaEjercicios() {
  const [ejercicios, setEjercicios] = useState([]);
  const [filtro, setFiltro] = useState({
    curso: '',
    materia: '',
    tema: '',
    contenido: ''
  });
  const [ejercicioEditando, setEjercicioEditando] = useState(null);

  const cargarEjercicios = async () => {
    let query = supabase.from('ejercicios').select('*');

    if (filtro.curso) query = query.eq('curso', filtro.curso);
    if (filtro.materia) query = query.eq('materia', filtro.materia);
    if (filtro.tema) query = query.ilike('tema', `%${filtro.tema}%`);
    if (filtro.contenido) query = query.ilike('contenido', `%${filtro.contenido}%`);

    const { data, error } = await query;
    if (error) {
      alert('Error al cargar ejercicios: ' + error.message);
    } else {
      setEjercicios(data);
    }
  };

  useEffect(() => {
    cargarEjercicios();
  }, [filtro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Consulta de ejercicios</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Curso:
          <select name="curso" value={filtro.curso} onChange={handleChange}>
            <option value="">Todos</option>
            <option value="1º ESO">1º ESO</option>
            <option value="2º ESO">2º ESO</option>
            <option value="3º ESO">3º ESO</option>
            <option value="4º ESO">4º ESO</option>
            <option value="1º Bachillerato">1º Bachillerato</option>
            <option value="2º Bachillerato">2º Bachillerato</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>Materia:
          <select name="materia" value={filtro.materia} onChange={handleChange}>
            <option value="">Todas</option>
            <option value="Matemáticas ESO">Matemáticas ESO</option>
            <option value="Matemáticas A">Matemáticas A</option>
            <option value="Matemáticas B">Matemáticas B</option>
            <option value="Matemáticas Aplicadas a las Ciencias Sociales 1">Matemáticas Aplicadas a las Ciencias Sociales 1</option>
            <option value="Matemáticas 1">Matemáticas 1</option>
            <option value="Matemáticas Aplicadas a las Ciencias Sociales 2">Matemáticas Aplicadas a las Ciencias Sociales 2</option>
            <option value="Matemáticas 2">Matemáticas 2</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>Tema:
          <input name="tema" value={filtro.tema} onChange={handleChange} />
        </label>

        <label style={{ marginLeft: '1rem' }}>Contenido:
          <input name="contenido" value={filtro.contenido} onChange={handleChange} />
        </label>
      </div>

      <hr />

      {/* Formulario de edición */}
      {ejercicioEditando && (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '2px dashed #999' }}>
          <h4>Editando ejercicio</h4>
          <textarea
            value={ejercicioEditando.enunciado}
            onChange={(e) => setEjercicioEditando({ ...ejercicioEditando, enunciado: e.target.value })}
            rows={3}
            style={{ width: '100%' }}
          />
          <textarea
            value={ejercicioEditando.solucion}
            onChange={(e) => setEjercicioEditando({ ...ejercicioEditando, solucion: e.target.value })}
            rows={3}
            style={{ width: '100%', marginTop: '1rem' }}
          />
          <button onClick={async () => {
            const { error } = await supabase
              .from('ejercicios')
              .update({
                enunciado: ejercicioEditando.enunciado,
                solucion: ejercicioEditando.solucion
              })
              .eq('id', ejercicioEditando.id);
            if (error) alert('Error al actualizar: ' + error.message);
            else {
              alert('Ejercicio actualizado');
              setEjercicioEditando(null);
              cargarEjercicios();
            }
          }}>Guardar cambios</button>
          <button onClick={() => setEjercicioEditando(null)} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </div>
      )}

      {/* Lista de ejercicios */}
      {ejercicios.length === 0 ? (
        <p>No se han encontrado ejercicios.</p>
      ) : (
        ejercicios.map((ej, i) => (
          <div key={i} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
            <strong>{ej.curso} - {ej.materia}</strong><br />
            <em>{ej.tema} | {ej.contenido}</em><br />
            {ej.peVAU && (
              <p>PeVAU: {ej.comunidad_autonoma}, {ej.año}, {ej.convocatoria}</p>
            )}
            <h4>Enunciado</h4>
            <BlockMath math={ej.enunciado} />
            {ej.solucion && (
              <>
                <h4>Solución</h4>
                <BlockMath math={ej.solucion} />
              </>
            )}
            <button onClick={() => setEjercicioEditando(ej)} style={{ marginTop: '1rem' }}>Editar</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ConsultaEjercicios;
