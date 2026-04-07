// Booking functionality module
import { state, saveState } from './state.js';

export function openBookingModal(day) {
    const modal = document.getElementById('bookingModal');
    const title = document.getElementById('modalTitle');
    const periodsList = document.getElementById('periodsAvailable');

    const dateKey = `${state.currentYear}-${state.currentMonth}-${day}`;
    const key = `${state.currentYear}-${state.currentMonth}`;
    
    // Check if there's a custom configuration for this specific day
    let config = null;
    const monthConfig = state.configurations[key];
    const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];

    if (customConfig) {
        config = customConfig;
    } else if (monthConfig && monthConfig.daysConfig) {
        const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
        const withinRange = day >= (monthConfig.startDay || 1) && day <= (monthConfig.endDay || daysInMonth);
        if (withinRange) {
            const dayOfWeek = new Date(state.currentYear, state.currentMonth, day).getDay();
            config = monthConfig.daysConfig[dayOfWeek] || null;
        }
    }

    if (!config) return;

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    title.textContent = `${day} de ${months[state.currentMonth]} de ${state.currentYear}`;

    const dayBookings = state.bookings[dateKey] || [];

    periodsList.innerHTML = '';

    config.periods.forEach((period, index) => {
        const periodCard = createPeriodCard(period, index, dayBookings, dateKey, day);
        periodsList.appendChild(periodCard);
    });

    modal.classList.add('active');
}

function createPeriodCard(period, index, dayBookings, dateKey, day) {
    const periodBookings = dayBookings.filter(b => b.periodIndex === index && !b.cancellation);
    const totalSlots = period.slots || 1;
    const availableSlots = totalSlots - periodBookings.length;
    const isFullyBooked = availableSlots <= 0;

    const periodCard = document.createElement('div');
    periodCard.className = `period-card ${isFullyBooked ? 'booked' : ''}`;
    periodCard.innerHTML = `
        <h3>${period.name}</h3>
        <p>${period.start} - ${period.end}</p>
        <p class="slots-info"><strong>Vagas disponíveis: ${availableSlots} de ${totalSlots}</strong></p>
    `;

    if (!isFullyBooked) {
        periodCard.addEventListener('click', () => {
            showBookingForm(dateKey, index, period, day);
        });
    }

    return periodCard;
}

export function showBookingForm(dateKey, periodIndex, period, day) {
    const modal = document.getElementById('bookingModal');
    const title = document.getElementById('modalTitle');
    const periodsList = document.getElementById('periodsAvailable');

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    title.textContent = `Reservar: ${period.name}`;

    periodsList.innerHTML = `
        <div class="booking-form">
            <p class="booking-info">${day} de ${months[state.currentMonth]} de ${state.currentYear}</p>
            <p class="booking-info">${period.start} - ${period.end}</p>
            <label for="bookingType">Tipo:</label>
            <select id="bookingType">
                <option value="civil">Civil</option>
                <option value="militar">Militar</option>
            </select>
            <div id="civilFields">
                <label for="bookingName">Nome completo:</label>
                <input type="text" id="bookingName" placeholder="Nome completo" required style="text-transform: uppercase;"/>
                <label for="bookingCpf">CPF:</label>
                <input type="text" id="bookingCpf" placeholder="000.000.000-00" required maxlength="14"/>
                <label for="bookingPhone">WhatsApp (DDD + Telefone):</label>
                <input type="tel" id="bookingPhone" placeholder="11999999999" required maxlength="11" pattern="[0-9]{11}"/>
                <small style="color: #666; font-size: 12px;">Digite apenas números (11 dígitos)</small>
            </div>
            <div id="militarFields" style="display:none;">
                <label for="bookingWarName">Nome de Guerra:</label>
                <input type="text" id="bookingWarName" placeholder="NOME DE GUERRA" style="text-transform: uppercase;"/>
                <label for="bookingGraduation">Graduação:</label>
                <select id="bookingGraduation">
                    <option>Cel PM</option><option>Ten Cel PM</option><option>Maj PM</option><option>Cap PM</option>
                    <option>1º Ten PM</option><option>2º Ten PM</option><option>Asp Of PM</option><option>Sub Ten PM</option>
                    <option>1º Sgt PM</option><option>2º Sgt PM</option><option>3º Sgt PM</option><option>Cb PM</option>
                    <option>Sd PM 1ª Cl</option><option>Sd PM 2ª Cl</option>
                </select>
                <label for="bookingRE">RE:</label>
                <input type="text" id="bookingRE" placeholder="RE" maxlength="10" pattern="[0-9]{1,10}"/>
                <label for="bookingPhoneM">WhatsApp (DDD + Telefone):</label>
                <input type="tel" id="bookingPhoneM" placeholder="11999999999" maxlength="11" pattern="[0-9]{11}"/>
                <small style="color: #666; font-size: 12px;">Digite apenas números (11 dígitos)</small>
            </div>
            <label for="bookingComplaint">Queixa (obrigatório):</label>
            <textarea id="bookingComplaint" placeholder="Descreva sua queixa (mínimo 10, máximo 100 caracteres)" minlength="10" maxlength="100" required style="text-transform: uppercase;"></textarea>
            <small style="color: #666; font-size: 12px;" id="complaintCounter">0/100 caracteres</small>
            <div class="booking-actions">
                <button class="btn-secondary" id="cancelBooking">Cancelar</button>
                <button class="btn-primary" id="confirmBooking">Confirmar Reserva</button>
            </div>
        </div>
    `;

    setupBookingFormHandlers(dateKey, periodIndex, day);
}

function setupBookingFormHandlers(dateKey, periodIndex, day) {
    const typeSelect = document.getElementById('bookingType');
    const civilFields = document.getElementById('civilFields');
    const militarFields = document.getElementById('militarFields');
    const nameInput = document.getElementById('bookingName');
    const cpfInput = document.getElementById('bookingCpf');
    const phoneInput = document.getElementById('bookingPhone');
    const warNameInput = document.getElementById('bookingWarName');
    const gradInput = document.getElementById('bookingGraduation');
    const reInput = document.getElementById('bookingRE');
    const phoneMInput = document.getElementById('bookingPhoneM');
    const complaintInput = document.getElementById('bookingComplaint');
    const complaintCounter = document.getElementById('complaintCounter');
    const confirmBtn = document.getElementById('confirmBooking');
    const cancelBtn = document.getElementById('cancelBooking');

    typeSelect.addEventListener('change', () => {
        const isMilitar = typeSelect.value === 'militar';
        civilFields.style.display = isMilitar ? 'none' : 'block';
        militarFields.style.display = isMilitar ? 'block' : 'none';
        validateForm();
    });

    cpfInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, ''); if (v.length > 11) v = v.slice(0,11);
        if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
        else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/,'$1.$2.$3');
        else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/,'$1.$2');
        e.target.value = v; validateForm();
    });

    [phoneInput, phoneMInput, reInput].forEach(inp => inp && inp.addEventListener('input', (e)=>{ e.target.value=e.target.value.replace(/\D/g,''); validateForm(); }));

    nameInput && nameInput.addEventListener('input', ()=>{ nameInput.value = nameInput.value.toUpperCase(); validateForm(); });
    warNameInput && warNameInput.addEventListener('input', ()=>{ warNameInput.value = warNameInput.value.toUpperCase(); validateForm(); });
    
    complaintInput.addEventListener('input', ()=>{ 
        complaintInput.value = complaintInput.value.toUpperCase();
        complaintCounter.textContent = `${complaintInput.value.length}/100 caracteres`;
        validateForm(); 
    });

    const validateForm = () => {
        const complaint = complaintInput.value.trim();
        const complaintValid = complaint.length >= 10 && complaint.length <= 100;
        
        const isMilitar = typeSelect.value === 'militar';
        if (!isMilitar) {
            const cpf = (cpfInput.value||'').replace(/\D/g,''); const ph = (phoneInput.value||'').trim();
            confirmBtn.disabled = !(nameInput.value.trim().length>0 && cpf.length===11 && ph.length===11 && complaintValid);
        } else {
            const ph = (phoneMInput.value||'').trim(); const re = (reInput.value||'').trim();
            confirmBtn.disabled = !(warNameInput.value.trim().length>0 && gradInput.value && re.length>=1 && ph.length===11 && complaintValid);
        }
    };

    confirmBtn.disabled = true; validateForm();

    confirmBtn.addEventListener('click', () => {
        const complaint = complaintInput.value.trim();
        if (complaint.length < 10 || complaint.length > 100) return;
        
        const isMilitar = typeSelect.value === 'militar';
        let bookingData;
        if (!isMilitar) {
            const cpf = cpfInput.value.replace(/\D/g,''); const phone = phoneInput.value.trim();
            if (!(nameInput.value.trim() && cpf.length===11 && phone.length===11)) return;
            bookingData = { type:'civil', name:nameInput.value.trim(), cpf, phone, complaint };
        } else {
            const phone = phoneMInput.value.trim(); const re = reInput.value.trim();
            if (!(warNameInput.value.trim() && gradInput.value && re.length>=1 && phone.length===11)) return;
            bookingData = { type:'militar', warName:warNameInput.value.trim(), graduation:gradInput.value, re, phone, complaint };
        }
        bookPeriod(dateKey, periodIndex, bookingData);
        document.getElementById('bookingModal').classList.remove('active');
        showConfirmationModal(dateKey, periodIndex, bookingData, day);
    });

    cancelBtn.addEventListener('click', () => { openBookingModal(day); });
}

function bookPeriod(dateKey, periodIndex, bookingData) {
    if (!state.bookings[dateKey]) {
        state.bookings[dateKey] = [];
    }
    state.bookings[dateKey].push({
        periodIndex,
        ...bookingData,
        timestamp: new Date().toISOString()
    });
    saveState();
    window.dispatchEvent(new CustomEvent('stateUpdated'));
}

export function showConfirmationModal(dateKey, periodIndex, bookingData, day) {
    const modal = document.getElementById('confirmationModal');
    const detailsDiv = document.getElementById('confirmationDetails');
    
    const [year, month, dayNum] = dateKey.split('-').map(Number);
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const key = `${year}-${month}`;
    const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];
    const monthConfig = state.configurations[key];
    let config = null;
    if (customConfig) {
        config = customConfig;
    } else if (monthConfig && monthConfig.daysConfig) {
        const dayOfWeek = new Date(year, month, dayNum).getDay();
        config = monthConfig.daysConfig[dayOfWeek] || null;
    }
    const period = config?.periods[periodIndex];
    
    if (!period) return;
    
    const formattedCpf = bookingData.cpf ? bookingData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : null;
    
    detailsDiv.innerHTML = `
        <h3>Comprovante de Agendamento</h3>
        <p><strong>Data:</strong> ${dayNum} de ${months[month]} de ${year}</p>
        <p><strong>Período:</strong> ${period.name}</p>
        <p><strong>Horário:</strong> ${period.start} - ${period.end}</p>
        <p><strong>Tipo:</strong> ${bookingData.type === 'militar' ? 'Militar' : 'Civil'}</p>
        ${bookingData.type === 'militar' ? `
            <p><strong>Nome de Guerra:</strong> ${bookingData.warName}</p>
            <p><strong>Graduação:</strong> ${bookingData.graduation}</p>
            <p><strong>RE:</strong> ${bookingData.re}</p>
        ` : `
            <p><strong>Paciente:</strong> ${bookingData.name}</p>
            <p><strong>CPF:</strong> ${formattedCpf}</p>
        `}
        <p><strong>WhatsApp:</strong> ${bookingData.phone}</p>
        <p><strong>Queixa:</strong> ${bookingData.complaint}</p>
        <p><strong>Confirmado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
    `;
    
    // Store booking info for sharing
    modal.dataset.bookingInfo = JSON.stringify({
        date: `${dayNum} de ${months[month]} de ${year}`,
        period: period.name,
        time: `${period.start} - ${period.end}`,
        type: bookingData.type,
        name: bookingData.type==='militar' ? bookingData.warName : bookingData.name,
        extra: bookingData.type==='militar' ? `Graduação: ${bookingData.graduation} | RE: ${bookingData.re}` : `CPF: ${formattedCpf}`,
        cpf: formattedCpf || '',
        phone: bookingData.phone,
        complaint: bookingData.complaint,
        timestamp: new Date().toLocaleString('pt-BR')
    });
    
    modal.classList.add('active');
}

export function showReport() {
    const reportModal = document.getElementById('reportModal');
    const reportContent = document.getElementById('reportContent');

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    let html = '';
    const bookingEntries = Object.entries(state.bookings).sort();

    if (bookingEntries.length === 0) {
        html = '<p class="no-bookings">Nenhuma reserva encontrada.</p>';
    } else {
        bookingEntries.forEach(([dateKey, bookings]) => {
            html += generateReportDateGroup(dateKey, bookings, months);
        });
    }

    reportContent.innerHTML = html;

    reportContent.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dateKey = e.target.dataset.date;
            const bookingIndex = parseInt(e.target.dataset.index);
            window.dispatchEvent(new CustomEvent('showCancellationModal', { 
                detail: { dateKey, bookingIndex } 
            }));
        });
    });

    reportModal.classList.add('active');
}

function generateReportDateGroup(dateKey, bookings, months) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const monthConfig = state.configurations[`${year}-${month}`];

    let html = `<div class="report-date-group">
        <h3>${day} de ${months[month]} de ${year}</h3>
        <div class="report-bookings">`;

    bookings.forEach((booking, bookingIndex) => {
        const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];
        let config = null;
        if (customConfig) {
            config = customConfig;
        } else if (monthConfig && monthConfig.daysConfig) {
            const dayOfWeek = new Date(year, month, day).getDay();
            config = monthConfig.daysConfig[dayOfWeek] || null;
        }
        const period = config?.periods[booking.periodIndex];
        const periodName = period ? period.name : 'Período desconhecido';
        const periodTime = period ? `${period.start} - ${period.end}` : '';

        html += generateBookingCard(booking, periodName, periodTime, dateKey, bookingIndex);
    });

    html += `</div></div>`;
    return html;
}

function generateBookingCard(booking, periodName, periodTime, dateKey, bookingIndex) {
    const cleanPhone = booking.phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${cleanPhone}`;
    const formattedCpf = booking.cpf ? booking.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : null;
    
    return `
        <div class="report-booking-card">
            <div class="report-booking-header">
                <strong>${periodName}</strong>
                <span class="report-booking-time">${periodTime}</span>
            </div>
            <div class="report-booking-details">
                <p><strong>Tipo:</strong> ${booking.type === 'militar' ? 'Militar' : 'Civil'}</p>
                ${booking.type === 'militar' ? `
                    <p><strong>Nome de Guerra:</strong> ${booking.warName}</p>
                    <p><strong>Graduação:</strong> ${booking.graduation}</p>
                    <p><strong>RE:</strong> ${booking.re}</p>
                ` : `
                    <p><strong>Paciente:</strong> ${booking.name}</p>
                    <p><strong>CPF:</strong> ${formattedCpf || 'N/A'}</p>
                `}
                <p style="display:flex;align-items:center;gap:8px;">
                    <strong>WhatsApp:</strong>
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-link">${booking.phone}</a>
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-icon" title="Abrir WhatsApp">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
                    </a>
                </p>
                ${booking.complaint ? `<p><strong>Queixa:</strong> ${booking.complaint}</p>` : ''}
                ${booking.entity ? `<p><strong>Entidade:</strong> ${booking.entity}</p>` : ''}
                ${booking.details ? `<p><strong>Descrição:</strong> ${booking.details}</p>` : ''}
                <p class="report-booking-timestamp">Reservado em: ${new Date(booking.timestamp).toLocaleString('pt-BR')}</p>
                ${booking.cancellation ? `
                    <p class="report-booking-cancellation"><strong>CANCELADO</strong><br>
                    Motivo: ${booking.cancellation.reason}<br>Solicitado por: ${booking.cancellation.requestedBy}<br>
                    Cancelado em: ${new Date(booking.cancellation.timestamp).toLocaleString('pt-BR')}</p>
                ` : `
                    <button class="btn-cancel" data-date="${dateKey}" data-index="${bookingIndex}">Cancelar Reserva</button>
                `}
            </div>
        </div>
    `;
}

export function showSearchBookings() {
    const modal = document.getElementById('searchBookingsModal');
    modal.classList.add('active');
    document.getElementById('searchCpf').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

export function searchBookingsByCpf() {
    const cpfInput = document.getElementById('searchCpf');
    const searchResults = document.getElementById('searchResults');
    const filterValue = document.querySelector('input[name="bookingFilter"]:checked').value;
    
    const searchCpf = cpfInput.value.replace(/\D/g, '');
    
    if (searchCpf.length !== 11) {
        searchResults.innerHTML = '<p class="no-bookings">Por favor, digite um CPF válido (11 dígitos).</p>';
        return;
    }
    
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let foundBookings = [];
    
    // Get current date and time
    const now = new Date();
    
    // Search through all bookings
    Object.entries(state.bookings).forEach(([dateKey, bookings]) => {
        bookings.forEach((booking, index) => {
            if (booking.cpf && booking.cpf.replace(/\D/g, '') === searchCpf) {
                const [year, month, day] = dateKey.split('-').map(Number);
                const configKey = `${year}-${month}`;
                const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];
                const monthConfig = state.configurations[configKey];
                let config = null;
                if (customConfig) {
                    config = customConfig;
                } else if (monthConfig && monthConfig.daysConfig) {
                    const dayOfWeek = new Date(year, month, day).getDay();
                    config = monthConfig.daysConfig[dayOfWeek] || null;
                }
                const period = config?.periods[booking.periodIndex];
                
                // Determine booking status
                const isCancelled = !!booking.cancellation;
                
                let isActive = false;
                let isCompleted = false;
                
                if (!isCancelled && period) {
                    // Parse end time of the period
                    const [endHour, endMinute] = period.end.split(':').map(Number);
                    const bookingEndDateTime = new Date(year, month, day, endHour, endMinute);
                    
                    // Active means the end time hasn't passed yet
                    isActive = now < bookingEndDateTime;
                    // Completed means the end time has passed
                    isCompleted = now >= bookingEndDateTime;
                }
                
                // Apply filter
                let includeBooking = false;
                if (filterValue === 'all') includeBooking = true;
                else if (filterValue === 'active' && isActive) includeBooking = true;
                else if (filterValue === 'completed' && isCompleted) includeBooking = true;
                else if (filterValue === 'cancelled' && isCancelled) includeBooking = true;
                
                if (includeBooking) {
                    foundBookings.push({ dateKey, booking, bookingIndex: index });
                }
            }
        });
    });
    
    if (foundBookings.length === 0) {
        searchResults.innerHTML = '<p class="no-bookings">Nenhum agendamento encontrado para este CPF com o filtro selecionado.</p>';
        return;
    }
    
    // Sort by date (newest first)
    foundBookings.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    
    let html = '<div class="report-content">';
    
    foundBookings.forEach(({ dateKey, booking, bookingIndex }) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const config = state.configurations[`${year}-${month}`];
        const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];
        const effectiveConfig = customConfig || config;
        const period = effectiveConfig?.periods[booking.periodIndex];
        
        if (!period) return;
        
        const periodName = period.name;
        const periodTime = `${period.start} - ${period.end}`;
        
        html += `<div class="report-date-group">
            <h3>${day} de ${months[month]} de ${year}</h3>
            <div class="report-bookings">`;
        
        html += generateBookingCard(booking, periodName, periodTime, dateKey, bookingIndex);
        
        html += `</div></div>`;
    });
    
    html += '</div>';
    searchResults.innerHTML = html;
    
    // Add cancel button handlers
    searchResults.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dateKey = e.target.dataset.date;
            const bookingIndex = parseInt(e.target.dataset.index);
            window.dispatchEvent(new CustomEvent('showCancellationModal', { 
                detail: { dateKey, bookingIndex } 
            }));
        });
    });
}