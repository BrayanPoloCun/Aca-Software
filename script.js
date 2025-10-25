const criterios = ['Usabilidad', 'Eficiencia', 'Seguridad', 'Funcionalidad', 'Mantenibilidad'];
const contenedor = document.getElementById('criterios');

criterios.forEach(nombre => {
  const div = document.createElement('div');
  div.className = 'mb-3';
  div.innerHTML = `
    <label class="form-label fw-semibold">${nombre}</label>
    <div class="d-flex align-items-center gap-2">
      <input type="range" class="form-range" min="1" max="5" value="3" step="0.5" oninput="this.nextElementSibling.textContent=this.value">
      <span class="text-primary fw-bold">3</span>
    </div>`;
  contenedor.appendChild(div);
});

function guardarEvaluacion() {
  const evaluador = document.getElementById('evaluador').value.trim();
  const nombreApp = document.getElementById('nombreApp').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const valores = [...document.querySelectorAll('#criterios input[type=range]')].map(r => parseFloat(r.value));
  const promedio = valores.reduce((a,b)=>a+b,0)/valores.length;
  const fecha = new Date().toLocaleString();

  if(!evaluador || !nombreApp){
    alert('Por favor completa todos los campos.');
    return;
  }

  const nuevaEval = { evaluador, nombreApp, descripcion, criterios, valores, promedio, fecha };
  const registros = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
  registros.push(nuevaEval);
  localStorage.setItem('evaluaciones', JSON.stringify(registros));
  alert('Evaluación guardada con éxito.');
  cargarHistorial();
}

function cargarHistorial() {
  const registros = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
  const lista = document.getElementById('listaHistorial');
  lista.innerHTML = '';

  if (registros.length === 0) {
    lista.innerHTML = '<p class="text-muted text-center">No hay evaluaciones registradas aún.</p>';
    return;
  }

  registros.forEach((reg, i) => {
    const card = document.createElement('div');
    card.className = 'eval-card';
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1 text-primary">${reg.nombreApp}</h6>
          <p class="mb-1 small"><strong>Evaluador:</strong> ${reg.evaluador}</p>
          <p class="mb-1 small"><strong>Promedio:</strong> ${reg.promedio.toFixed(2)}</p>
          <p class="mb-1 small text-muted">${reg.fecha}</p>
        </div>
        <div class="text-end">
          <button class="btn btn-outline-primary btn-sm mb-2" onclick="mostrarEvaluacion(${i})">Ver</button><br>
          <button class="delete-btn" onclick="eliminarEvaluacion(${i})">Eliminar</button>
        </div>
      </div>
    `;
    lista.appendChild(card);
  });
}

function mostrarEvaluacion(index) {
  const registros = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
  const reg = registros[index];

  const ctx = document.getElementById('grafico').getContext('2d');
  if(window.graficoInstancia) window.graficoInstancia.destroy();
  window.graficoInstancia = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: reg.criterios,
      datasets: [{
        label: `Evaluación - ${reg.nombreApp}`,
        data: reg.valores,
        backgroundColor: 'rgba(13,110,253,0.3)',
        borderColor: '#0d6efd',
        borderWidth: 2,
        pointBackgroundColor: '#0d6efd'
      }]
    },
    options: {
      plugins: { legend: { display: true } },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: { stepSize: 1, color: '#0d6efd' },
          grid: { color: 'rgba(0,0,0,0.1)' },
          angleLines: { color: 'rgba(0,0,0,0.1)' }
        }
      }
    }
  });
}

function eliminarEvaluacion(index) {
  const registros = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
  if(confirm('¿Seguro que deseas eliminar esta evaluación?')) {
    registros.splice(index, 1);
    localStorage.setItem('evaluaciones', JSON.stringify(registros));
    cargarHistorial();
  }
}

cargarHistorial();
