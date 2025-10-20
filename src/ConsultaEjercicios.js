import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

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
  const [seleccionados, setSeleccionados] = useState([]);
  const [modoExportacion, setModoExportacion] = useState('pdf'); // 'pdf', 'tex', 'ambos'

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

  const exportarPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    const seleccion = ejercicios.filter(ej => seleccionados.includes(ej.id));

    seleccion.forEach((ej, index) => {
      doc.setFontSize(12);
      doc.text(`${ej.curso} - ${ej.materia}`, 10, y);
      y += 6;
      doc.text(`Tema: ${ej.tema} | Contenido: ${ej.contenido}`, 10, y);
      y += 6;
      doc.text(`Enunciado: ${ej.enunciado}`, 10, y);
      y += 6;
      if (ej.solucion) {
        doc.text(`Solución: ${ej.solucion}`, 10, y);
        y += 6;
      }
      if (ej.peVAU) {
        doc.text(`PeVAU: ${ej.comunidad_autonoma}, ${ej.año}, ${ej.convocatoria}`, 10, y);
        y += 6;
      }
      y += 10;
      if (y > 270 && index < seleccion.length - 1) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save('ejercicios.pdf');
  };

  const exportarLaTeX = () => {
    const seleccion = ejercicios.filter(ej => seleccionados.includes(ej.id));
    let contenido = '';

    seleccion.forEach((ej) => {
      contenido += `\\section*{${ej.curso} - ${ej.materia}}\n`;
      contenido += `\\textbf{Tema:} ${ej.tema} \\quad \\textbf{Contenido:} ${ej.contenido}\n\n`;
      contenido += `\\subsection*{Enunciado}\n\

\[${ej.enunciado}\\]

\n\n`;
      if (ej.solucion) {
        contenido += `\\subsection*{Solución}\n\

\[${ej.solucion}\\]

\n\n`;
      }
      if (ej.peVAU) {
        contenido += `\\textit{PeVAU: ${ej.comunidad_autonoma}, ${ej.año}, ${ej.convocatoria}}\n\n`;
      }
      contenido += '\\bigskip\n\n';
    });

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'ejercicios.tex');
  };

  const exportarSeleccionados = () => {
    if (modoExportacion === 'pdf') exportarPDF();
    else if (modoExportacion === 'tex') exportarLaTeX();
    else {
      exportarPDF();
      exportarLaTeX();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Consulta de ejercicios</h2>

      {/* Filtros */}
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

      {/* Opciones de exportación */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Formato de exportación:
          <select value={modoExportacion} onChange={(e) => setModoExportacion(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="pdf">PDF</option>
            <option value="tex">LaTeX (.tex)</option>
            <option value="ambos">Ambos</option>
          </select>
        </label>
        <button
          onClick={exportarSeleccionados}
          disabled={seleccionados.length === 0}
          style={{ marginLeft: '1rem' }}
        >
          Exportar seleccionados
        </button>
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
                enunciado: ejercicioEditando