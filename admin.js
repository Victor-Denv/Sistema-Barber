<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Painel do Barbeiro</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container" style="max-width: 800px;">
        <h1>Painel Administrativo 💈</h1>
        
        <div class="dashboard-stats">
            <div class="card">
                <h3>Lucro Mês</h3>
                <div class="money" id="lucroMes">R$ 0,00</div>
            </div>
            <div class="card">
                <h3>Agendamentos</h3>
                <div class="money" id="totalAgendamentos">0</div>
            </div>
        </div>

        <div style="background: #444; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
            <h3>📅 Marcar Folga</h3>
            <div style="display: flex; gap: 10px;">
                <input type="date" id="dataFolga">
                <button id="btnFolga" style="width: auto;">Bloquear Dia</button>
            </div>
        </div>

        <h2>Agenda do Dia / Futura</h2>
        <div id="listaAdmin">
            </div>
    </div>

    <script type="module" src="admin.js"></script>
</body>
</html>