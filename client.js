// client.js ATUALIZADO (Com verificação de horário)
import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById('btnAgendar');
const msg = document.getElementById('msg');

btn.addEventListener('click', async () => {
    const nome = document.getElementById('nomeClient').value;
    const servicoSelect = document.getElementById('servico');
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const pagamento = document.getElementById('pagamento').value;

    // 1. Validação Básica
    if(!nome || !data || !hora) {
        msg.innerText = "Preencha todos os campos!";
        msg.style.color = "#cf6679";
        return;
    }

    try {
        btn.innerText = "Verificando disponibilidade...";
        btn.disabled = true;

        // 2. VERIFICAÇÃO DE DISPONIBILIDADE NO BANCO
        const q = query(collection(db, "agendamentos"), 
            where("data", "==", data), 
            where("hora", "==", hora)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Já existe agendamento neste horário!
            msg.innerText = "❌ Este horário já está ocupado! Escolha outro.";
            msg.style.color = "#cf6679"; // Vermelho
            btn.innerText = "Confirmar Horário";
            btn.disabled = false;
            return; // Para tudo aqui
        }

        // 3. Se passou, salva o agendamento
        const valor = parseFloat(servicoSelect.value);
        const servicoNome = servicoSelect.options[servicoSelect.selectedIndex].text.split('(')[0].trim();

        await addDoc(collection(db, "agendamentos"), {
            cliente: nome,
            servico: servicoNome,
            valor: valor,
            data: data,
            hora: hora,
            pagamento: pagamento,
            criadoEm: new Date().toISOString()
        });

        msg.innerText = "✅ Agendado com sucesso!";
        msg.style.color = "#c5a059"; // Dourado
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);

    } catch (error) {
        console.error(error);
        msg.innerText = "Erro no sistema.";
        btn.disabled = false;
    }
});