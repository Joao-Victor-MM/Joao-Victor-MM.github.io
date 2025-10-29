document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os controles que queremos persistir
    const controls = Array.from(document.querySelectorAll('input, textarea, select'));

    // Contabiliza ids e names para detectar duplicados e evitar chaves não-únicas
    const idCounts = {};
    const nameCounts = {};
    controls.forEach(el => {
        if (el.id) idCounts[el.id] = (idCounts[el.id] || 0) + 1;
        if (el.name) nameCounts[el.name] = (nameCounts[el.name] || 0) + 1;
    });

    controls.forEach((el, idx) => {
        // Decide uma chave única para cada elemento: preferir id (se único), senão name (se único), senão índice
        let key;
        if (el.id && idCounts[el.id] === 1) key = `persist:${el.tagName.toLowerCase()}:${el.id}`;
        else if (el.name && nameCounts[el.name] === 1) key = `persist:${el.tagName.toLowerCase()}:${el.name}`;
        else key = `persist:${el.tagName.toLowerCase()}:index-${idx}`;

        // Restaurar valor salvo (se existir)
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = stored === 'true';
            else el.value = stored;

            // Atualiza representação textual do range (se for o caso)
            if (el.type === 'range') {
                const rv = document.getElementById('rangeValue');
                if (rv) rv.textContent = el.value + '%';
            }
        }

        // Função para salvar o estado atual no localStorage
        const save = () => {
            if (el.type === 'checkbox' || el.type === 'radio') localStorage.setItem(key, el.checked);
            else localStorage.setItem(key, el.value);
        };

        // Use 'input' para a maioria, 'change' para selects e controles que mudam no blur
        const eventName = (el.tagName.toLowerCase() === 'select' || el.type === 'checkbox' || el.type === 'radio' || el.type === 'range') ? 'change' : 'input';
        el.addEventListener(eventName, () => {
            save();
            if (el.type === 'range') {
                const rv = document.getElementById('rangeValue');
                if (rv) rv.textContent = el.value + '%';
            }
        });
    });

    // Controles de sanidade
    const range = document.getElementById('rangeInput');
    const sanidadeAtual = document.getElementById('sanidadeAtual');
    const sanidadePlus = document.getElementById('sanidadeplus');
    const minus5 = document.getElementById('minus5');
    const minus1 = document.getElementById('minus1');
    const plus1 = document.getElementById('plus1');
    const plus5 = document.getElementById('plus5');

    // Configuração inicial
    if (range && sanidadeAtual && sanidadePlus) {
        // Define valor máximo inicial
        const maxInicial = parseInt(sanidadePlus.value) || 100;
        sanidadePlus.value = maxInicial;
        range.max = maxInicial;

        // Pega valor inicial da sanidade
        const valorInicial = parseInt(range.value) || 50;
        range.value = valorInicial;
        sanidadeAtual.value = valorInicial;
    }

    function atualizarSanidade(novoValor) {
        if (!range || !sanidadeAtual || !sanidadePlus) return;
        
        const max = parseInt(sanidadePlus.value) || 100;
        // Limita entre 0 e o máximo
        novoValor = Math.max(0, Math.min(max, parseInt(novoValor) || 0));
        
        // Atualiza todos os campos
        range.value = novoValor;
        sanidadeAtual.value = novoValor;
        
        // Salva no localStorage
        localStorage.setItem('persist:input:sanidadeAtual', novoValor.toString());
        localStorage.setItem('persist:input:rangeInput', novoValor.toString());
    }

    // Sincroniza range com input numérico
    if (range) {
        range.addEventListener('input', function() {
            atualizarSanidade(this.value);
        });
    }

    if (sanidadeAtual) {
        sanidadeAtual.addEventListener('change', function() {
            atualizarSanidade(this.value);
        });
    }

    // Configura máximo da sanidade
    if (sanidadePlus) {
        sanidadePlus.addEventListener('change', function() {
            if (!range) return;
            
            const novoMaximo = parseInt(this.value) || 100;
            range.max = novoMaximo;
            localStorage.setItem('persist:input:sanidadeplus', novoMaximo.toString());
            
            // Ajusta valor atual se necessário
            const atual = parseInt(sanidadeAtual?.value) || 0;
            if (atual > novoMaximo) {
                atualizarSanidade(novoMaximo);
            }
        });

        // Restaura máximo salvo
        const maxSalvo = localStorage.getItem('persist:input:sanidadeplus');
        if (maxSalvo !== null) {
            sanidadePlus.value = maxSalvo;
            range.max = parseInt(maxSalvo);
        }
    }

    // Botões de controle
    if (minus5) {
        minus5.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual?.value) || 0;
            atualizarSanidade(atual - 5);
        });
    }

    if (minus1) {
        minus1.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual?.value) || 0;
            atualizarSanidade(atual - 1);
        });
    }

    if (plus1) {
        plus1.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual?.value) || 0;
            atualizarSanidade(atual + 1);
        });
    }

    if (plus5) {
        plus5.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual?.value) || 0;
            atualizarSanidade(atual + 5);
        });
    }
        });
    

    // Botões de controle
    if (minus5) {
        minus5.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual.value) || 0;
            atualizarSanidade(atual - 5);
        });
    }

    if (minus1) {
        minus1.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual.value) || 0;
            atualizarSanidade(atual - 1);
        });
    }

    if (plus1) {
        plus1.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual.value) || 0;
            atualizarSanidade(atual + 1);
        });
    }

    if (plus5) {
        plus5.addEventListener('click', () => {
            const atual = parseInt(sanidadeAtual.value) || 0;
            atualizarSanidade(atual + 5);
        });
    }
    

    // --- Interações de classes / perks (implementado 100% em JS) ---
    const classSelect = document.getElementById('classes');
    if (classSelect) {
        // cria o painel dinamicamente (sem tocar no HTML)
        const panel = document.createElement('div');
        panel.id = 'classPanel';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '8px';
        panel.style.marginTop = '8px';

        const title = document.createElement('h3');
        title.id = 'classTitle';
        title.textContent = 'Selecione uma classe';
        panel.appendChild(title);

        const desc = document.createElement('div');
        desc.id = 'classDesc';
        desc.style.whiteSpace = 'pre-wrap';
        desc.style.marginTop = '6px';
        desc.textContent = 'Descrição da classe aparecerá aqui.';
        panel.appendChild(desc);

        const optWrap = document.createElement('div');
        optWrap.style.marginTop = '8px';
        const optLabel = document.createElement('label');
        optLabel.htmlFor = 'classOption';
        optLabel.textContent = 'Opções:';
        optWrap.appendChild(optLabel);
        const optSelect = document.createElement('select');
        optSelect.id = 'classOption';
        optSelect.style.marginLeft = '6px';
        optWrap.appendChild(optSelect);
        panel.appendChild(optWrap);

        const btnWrap = document.createElement('div');
        btnWrap.style.marginTop = '8px';
        const applyBtn = document.createElement('button');
        applyBtn.id = 'applyPerksBtn';
        applyBtn.textContent = 'Aplicar perks';
        btnWrap.appendChild(applyBtn);
        const undoBtn = document.createElement('button');
        undoBtn.id = 'undoPerksBtn';
        undoBtn.textContent = 'Desfazer';
        undoBtn.disabled = true;
        undoBtn.style.marginLeft = '8px';
        btnWrap.appendChild(undoBtn);
        panel.appendChild(btnWrap);

        // insere o painel após o select de classes
        classSelect.parentNode.appendChild(panel);

    // mapeamento dos componentes de status (usando as classes .divXX existentes)
        const statMap = {
            forca: '.div13 input',
            vida: '.div14 input',
            durabilidade: '.div15 input',
            velocidade: '.div16 input',
            carisma: '.div17 input',
            inteligencia: '.div18 input',
            proficiencia: '.div19 input',
            armor: '.div10 input',
            hand: '.div11 input',
            offhand: '.div12 input',
            sanidade: '#rangeInput'
        };

        // captura os valores base (após restauração do localStorage) para podermos resetar
        const baseValues = {};
        Object.keys(statMap).forEach(key => {
            const el = (statMap[key].startsWith('#')) ? document.querySelector(statMap[key]) : document.querySelector(statMap[key]);
            if (!el) return;
            baseValues[key] = el.value;
        });

        // dados simplificados das classes (descrição e deltas nos stats)
        const classData = {
            'Fixer': {
                title: 'Fixer',
                desc: `Grau Inicial: 9\nAntecedente: Nobreza\nArma: Qualquer (Espada, Martelo, Adaga, Arma de fogo, etc.)\nTraço Principal: "Determinação Profissional" — +5% na recuperação de sanidade após completar um contrato ou matar um alvo marcado.\nProgressão: Ganha patrocínios corporativos e benefícios a cada subida de Grau (9 → 1).`,
                deltas: {forca:1, durabilidade:1, velocidade:1, carisma:2, inteligencia:1, proficiencia:1},
                backgrounds: ['Nobility']
            },
            'Cleaner': {
                title: 'Cleaner',
                desc: `Antecedente: W Corp (Engenharia Temporal)\nArma: Arma elétrica (Bastão de Choque, Faca de Plasma)\nTraço: "Eficiência Cronometrada" — a cada 3 turnos, reverte 1 turno de recargas (custo: -5% sanidade).\nPassivo: Imune a paralisia ou atordoamento enquanto sanidade > 50%.`,
                deltas: {inteligencia:2, proficiencia:2, durabilidade:1},
                backgrounds: ['Test subject', 'W Corp']
            },
            'Reindeer': {
                title: 'Reindeer',
                desc: `Papel: Supressão / Armas Pesadas\nArma: Lança-chamas pesado, Lâminas incendiárias\nAtributos: +3 Força, +2 Resistência, -2 Velocidade\nCusto de Sanidade: -5% por uso de arma pesada (fadiga)\nPassivo: Condicionamento Termogênico — imune a queimaduras, +3 em dano baseado em Fogo.`,
                deltas: {forca:3, durabilidade:2, velocidade:-2},
                backgrounds: ['Fire elemental', 'Military']
            },
            'Rabbit': {
                title: 'Rabbit',
                desc: `Papel: Velocidade / Assalto de Precisão\nArma: Rifles duplos ou adagas\nAtributos: +3 Destreza, +2 Velocidade, -2 Resistência\nCusto de Sanidade: -2% por ataque realizado (estresse neural de alta velocidade)\nPassivo: Implantação Rápida — pode se mover duas vezes por turno; ignora penalidades de movimento.`,
                deltas: {velocidade:3, durabilidade:-2, proficiencia:1},
                backgrounds: ['Hunter', 'Military']
            },
            'Rhino': {
                title: 'Rhino',
                desc: `Papel: Escudo / Defesa / Fortificação\nArma: Escudo de torre, martelo hidráulico\nAtributos: +4 Resistência, +2 Força, -2 Velocidade\nPassivo: Pele de Ferro — reduz todo dano físico recebido em 2d6.`,
                deltas: {forca:2, durabilidade:4, velocidade:-2},
                backgrounds: ['Tank', 'Military']
            },
            'Edgar Family Butler': {
                title: 'Edgar Family Butler',
                desc: `Antecedente: T Corp\nArma: Arma branca (cortes)\nTraço: Segundo Emprestado: Rerrolagem de uma defesa falhada\nPassivo: +2 de Velocidade contra humanos\nPerk Especial (L20): Congela todas as ações (-50% sanidade) exceto a sua (-20% sanidade)`,
                deltas: {durabilidade:3, velocidade:2, carisma:1},
                backgrounds: ['T Corp', 'Butler']
            },
            'The pequod sailor': {
                title: 'The pequod sailor',
                desc: `Antecedente: Marinheiro; Elemental Água\nArma: Arpão\nTraço: Abraço do Abismo — Em baixa sanidade ganha +10 Força mas perde controle de suas ações\nPassivo: Contra criaturas marinhas +5 Força, +2 Velocidade.`,
                deltas: {forca:3, vida:2, velocidade:1},
                backgrounds: ['Elemental', 'Sailor'] // Backgrounds obrigatórios
            },
            'Performer': {
                title: 'Performer',
                desc: `OBRIGATÓRIO Criatura de Sangue\nAntecedente: Sangue Elemental...\nTraço: Performance Insana — quando abaixo de 40% de sanidade, todas as rolagens ganham +2 mas cada sucesso custa -2% de sanidade.\nPassivo: +3 de Resistência`,
                deltas: {durabilidade:3, carisma:2, proficiencia:1},
                backgrounds: ['Elemental'] // Background obrigatório
            }
        };

    // para desfazer
    let prevValues = null;
    // classe atualmente aplicada (impede aplicar múltiplas vezes)
    let appliedClass = null;

        function getElByKey(key) {
            const sel = statMap[key];
            if (!sel) return null;
            return document.querySelector(sel);
        }

        function populatePanel(cls) {
            const data = classData[cls];
            if (!data) {
                title.textContent = 'Classe desconhecida';
                desc.textContent = '';
                optSelect.innerHTML = '';
                return;
            }
            title.textContent = data.title;
            desc.textContent = data.desc;

            // Cria ou atualiza o select de backgrounds
            let bgSelect = document.getElementById('backgroundSelect');
            let bgLabel = document.getElementById('backgroundLabel');
            
            if (!bgSelect) {
                const bgWrap = document.createElement('div');
                bgWrap.style.marginTop = '8px';
                bgLabel = document.createElement('label');
                bgLabel.id = 'backgroundLabel';
                bgLabel.htmlFor = 'backgroundSelect';
                bgLabel.textContent = 'Background Requerido:';
                bgWrap.appendChild(bgLabel);
                
                bgSelect = document.createElement('select');
                bgSelect.id = 'backgroundSelect';
                bgSelect.style.marginLeft = '6px';
                bgWrap.appendChild(bgSelect);
                
                // Insere antes do wrapper de botões
                panel.insertBefore(bgWrap, btnWrap);
            }

            // Limpa e preenche as opções de background
            bgSelect.innerHTML = '';
            if (data.backgrounds && data.backgrounds.length > 0) {
                data.backgrounds.forEach(bg => {
                    const opt = document.createElement('option');
                    opt.value = bg;
                    opt.textContent = bg;
                    bgSelect.appendChild(opt);
                });

                // Atualiza o campo de background quando uma opção é selecionada
                bgSelect.onchange = function() {
                    const backgroundInput = document.querySelector('.div6 input');
                    if (backgroundInput) {
                        backgroundInput.value = this.value;
                        backgroundInput.dispatchEvent(new Event('input', {bubbles: true}));
                        backgroundInput.dispatchEvent(new Event('change', {bubbles: true}));
                    }
                };

                bgSelect.style.display = '';
                bgLabel.style.display = '';
            } else {
                bgSelect.style.display = 'none';
                bgLabel.style.display = 'none';
            }

            // opções simples — deixar espaço para Grades/Colors futuramente
            optSelect.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = 'default';
            opt.textContent = 'Padrão';
            optSelect.appendChild(opt);
        }

        function applyDeltas(deltas) {
            // guarda valores anteriores
            prevValues = {};
            Object.keys(statMap).forEach(key => {
                const el = getElByKey(key);
                if (!el) return;
                // diferenciar range (sanidade) e inputs de número/texto
                if (el.type === 'range' || el.tagName.toLowerCase() === 'input' && el.type === 'range') {
                    prevValues[key] = el.value;
                    if (deltas.sanidade !== undefined) el.value = Number(el.value) + Number(deltas.sanidade);
                    // atualiza display do range
                    const rv = document.getElementById('rangeValue'); if (rv) rv.textContent = el.value + '%';
                    // dispara eventos para persistência
                    el.dispatchEvent(new Event('input', {bubbles:true}));
                    el.dispatchEvent(new Event('change', {bubbles:true}));
                    return;
                }

                // inputs numéricos
                const current = Number(el.value) || 0;
                prevValues[key] = el.value;
                const delta = Number(deltas[key]) || 0;
                // se campo for texto (armor/hand/offhand), concatena texto com trait/weapon
                if (key === 'armor' || key === 'hand' || key === 'offhand') {
                    if (deltas.weapon) {
                        // adiciona weapon ao campo
                        el.value = (el.value ? el.value + '; ' : '') + deltas.weapon;
                    }
                } else {
                    el.value = current + delta;
                }
                el.dispatchEvent(new Event('input', {bubbles:true}));
                el.dispatchEvent(new Event('change', {bubbles:true}));
            });
            undoBtn.disabled = false;
        }

        function undoDeltas() {
            if (!prevValues) return;
            Object.keys(prevValues).forEach(key => {
                const el = getElByKey(key);
                if (!el) return;
                el.value = prevValues[key];
                if (key === 'sanidade') {
                    const rv = document.getElementById('rangeValue'); if (rv) rv.textContent = el.value + '%';
                }
                el.dispatchEvent(new Event('input', {bubbles:true}));
                el.dispatchEvent(new Event('change', {bubbles:true}));
            });
            prevValues = null;
            undoBtn.disabled = true;
        }

        // inicializa com a classe atualmente selecionada
        populatePanel(classSelect.value);

        function checkBackgrounds(selectedClass) {
            const data = classData[selectedClass];
            if (!data || !data.backgrounds) return true;

            // Pega o valor do campo de background
            const backgroundField = document.querySelector('.div6 input');
            if (!backgroundField) return true;

            const currentBackground = backgroundField.value.toLowerCase();
            const requiredBackgrounds = data.backgrounds.map(bg => bg.toLowerCase());

            // Verifica se pelo menos um dos backgrounds requeridos está presente
            return requiredBackgrounds.some(bg => currentBackground.includes(bg));
        }

        classSelect.addEventListener('change', () => {
            // Verifica backgrounds primeiro
            const selectedClass = classSelect.value;
            if (!checkBackgrounds(selectedClass)) {
                alert('Esta classe requer um dos seguintes backgrounds: ' + classData[selectedClass].backgrounds.join(', '));
                classSelect.value = appliedClass || '';
                return;
            }

            // ao trocar de classe: resetamos todos os campos para os valores base
            Object.keys(baseValues).forEach(key => {
                const el = getElByKey(key);
                if (!el) return;
                el.value = baseValues[key];
                // atualiza display do range
                if (key === 'sanidade') {
                    const rv = document.getElementById('rangeValue'); if (rv) rv.textContent = el.value + '%';
                }
                el.dispatchEvent(new Event('input', {bubbles:true}));
                el.dispatchEvent(new Event('change', {bubbles:true}));
            });
            // ao trocar de classe permitimos aplicar novamente e limpamos estado de desfazer
            populatePanel(classSelect.value);
            prevValues = null;
            appliedClass = null;
            undoBtn.disabled = true;
            applyBtn.disabled = false;
        });

        applyBtn.addEventListener('click', () => {
            const key = classSelect.value;
            const data = classData[key];
            if (!data) return;
            // evita aplicar múltiplas vezes a mesma classe
            if (appliedClass === key) return;
            applyDeltas(data.deltas || {});
            appliedClass = key;
            // desabilita aplicar até desfazer ou trocar classe
            applyBtn.disabled = true;
        });

        undoBtn.addEventListener('click', () => {
            undoDeltas();
            // após desfazer, permitir aplicar novamente
            appliedClass = null;
            applyBtn.disabled = false;
        });
    };