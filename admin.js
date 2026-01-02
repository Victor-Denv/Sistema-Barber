import { db } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- VERIFICAÇÃO DE LOGIN ---
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Se NÃO tem usuário, manda pro login
        window.location.replace("login.html");
    } else {
        // Se tem usuário, libera o acesso (opcional: console.log para confirmar)
        console.log("Admin logado:", user.email);
    }
});

// ... RESTO DO CÓDIGO ...
const lista = document.getElementById('listaAdmin');
const elLucro = document.getElementById('lucroMes');
const elTotal = document.getElementById('totalAgendamentos');
const elTicket = document.getElementById('ticketMedio');

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const q = query(collection(db, "agendamentos"), orderBy("data"), orderBy("hora"));

onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";
    let totalLucro = 0;
    let totalCortes = 0;
    
    const hoje = new Date();
    const mesAtualString = hoje.toISOString().slice(0, 7); 

    snapshot.forEach(docSnap => {
        const ag = docSnap.data();
        const id = docSnap.id;

        if (ag.data.startsWith(mesAtualString) && ag.valor > 0) {
            totalLucro += ag.valor;
            totalCortes++;
        }

        const dataFormatada = ag.data.split('-').reverse().slice(0,2).join('/');
        const div = document.createElement('div');
        div.className = 'appointment';
        
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

    elLucro.innerText = brl.format(totalLucro);
    elTotal.innerText = totalCortes;
    const ticket = totalCortes > 0 ? (totalLucro / totalCortes) : 0;
    elTicket.innerText = brl.format(ticket);
});

window.deletar = async (id) => {
    if(confirm("Confirmar conclusão/remoção?")) {
        await deleteDoc(doc(db, "agendamentos", id));
    }
}

// Botão PROVISÓRIO para você testar o Sair (pode rodar no console também)
// Se tiver um botão com id="btnSair" no HTML, descomente abaixo:
/*
document.getElementById('btnSair').addEventListener('click', () => {
    signOut(auth).then(() => {
        alert("Deslogado!");
        window.location.reload(); // Vai forçar o refresh e cair no redirect
    });
});
*/

// Se tiver o botão de folga no HTML:
const btnFolga = document.getElementById('btnFolga');
if(btnFolga) {
    btnFolga.addEventListener('click', async () => {
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
}