import { db } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById('listaAdmin');
const elLucro = document.getElementById('lucroMes');
const elTotal = document.getElementById('totalAgendamentos');
const elTicket = document.getElementById('ticketMedio');

// Formatador de Moeda
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Query ordenada por data e hora
const q = query(collection(db, "agendamentos"), orderBy("data"), orderBy("hora"));

onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    
    let totalLucro = 0;
    let totalCortes = 0;
    
    // Mês Atual (ex: "2023-10")
    const hoje = new Date();
    const mesAtualString = hoje.toISOString().slice(0, 7); 

    snapshot.forEach(docSnap => {
        const ag = docSnap.data();
        const id = docSnap.id;

        // Cálculos (apenas se não for dia bloqueado/folga)
        if (ag.data.startsWith(mesAtualString) && ag.valor > 0) {
            totalLucro += ag.valor;
            totalCortes++;
        }

        // Formatação da Data para exibição (DD/MM)
        const dataFormatada = ag.data.split('-').reverse().slice(0,2).join('/');

        // HTML do Item
        const div = document.createElement('div');
        div.className = 'appointment';
        
        // Estilo diferente para folga
        if(ag.valor === 0) {
            div.style.borderLeft = "4px solid #cf6679";
            div.innerHTML = `
                <div class="appt-details">
                    <strong style="color:#cf6679">BLOQUEADO / FOLGA</strong>
                    <span>${dataFormatada} - Dia Inteiro</span>
                </div>
                <button onclick="deletar('${id}')" class="btn-icon">×</button>
            `;
        } else {
            div.innerHTML = `
                <div class="appt-details">
                    <strong>${ag.cliente}</strong>
                    <span>${dataFormatada} às ${ag.hora} • ${ag.servico}</span>
                </div>
                <div style="display:flex; align-items:center">
                    <div class="appt-meta">
                        <span class="price">${brl.format(ag.valor)}</span>
                        <span style="font-size:0.75rem; opacity:0.6; text-transform:uppercase;">${ag.pagamento}</span>
                    </div>
                    <button onclick="deletar('${id}')" class="btn-icon">✓</button>
                </div>
            `;
        }
        
        lista.appendChild(div);
    });

    // Atualizar Dashboard
    elLucro.innerText = brl.format(totalLucro);
    elTotal.innerText = totalCortes;
    
    // Evitar divisão por zero no ticket médio
    const ticket = totalCortes > 0 ? (totalLucro / totalCortes) : 0;
    elTicket.innerText = brl.format(ticket);
});

// Funções Globais
window.deletar = async (id) => {
    // Pequeno delay para efeito visual, se quisesse adicionar animação
    if(confirm("Confirmar conclusão/remoção?")) {
        await deleteDoc(doc(db, "agendamentos", id));
    }
}

// Botão de Folga (Simplificado para Minimalismo)
document.getElementById('btnFolga').addEventListener('click', async () => {
    const dataFolga = prompt("Digite a data da folga (AAAA-MM-DD):", new Date().toISOString().split('T')[0]);
    
    if (dataFolga) {
        await addDoc(collection(db, "agendamentos"), {
            cliente: "FOLGA",
            servico: "Bloqueio",
            valor: 0,
            data: dataFolga,
            hora: "00:00",
            pagamento: "-",
            criadoEm: new Date().toISOString()
        });
    }
});