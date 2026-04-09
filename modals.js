// Modal management module
import { state, saveState } from './state.js';
import { renderBlockedCalendar, renderCalendar } from './calendar.js';
import { renderCustomizeCalendar } from './admin.js';

export function initializeModals() {
    initializeBookingModal();
    initializeReportModal();
    initializeBlockedDaysModal();
    initializeCancellationModal();
    initializeCustomizeDayModal();
    initializeCustomizeDayFormModal();
    initializeSearchBookingsModal();
    initializeConfirmationModal();
    initializeBookingPasswordModal();
    initializeSetBookingPasswordModal();
    initializeStatisticsModal();
    initializePatientSearchModal();
}

function initializeBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = modal.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function initializeReportModal() {
    const reportModal = document.getElementById('reportModal');
    const closeReport = document.getElementById('closeReport');
    const applyFilterBtn = document.getElementById('applyReportDateFilter');
    const clearFilterBtn = document.getElementById('clearReportDateFilter');

    closeReport.addEventListener('click', () => {
        reportModal.classList.remove('active');
    });

    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.classList.remove('active');
        }
    });

    applyFilterBtn.addEventListener('click', () => {
        const dateFilter = document.getElementById('reportDateFilter').value;
        if (dateFilter) {
            window.dispatchEvent(new CustomEvent('showReportWithFilter', { detail: { filterDate: dateFilter } }));
        }
    });

    clearFilterBtn.addEventListener('click', () => {
        document.getElementById('reportDateFilter').value = '';
        window.dispatchEvent(new CustomEvent('showReport'));
    });
}

function initializeBlockedDaysModal() {
    const blockedDaysModal = document.getElementById('blockedDaysModal');
    const closeBlockedDays = document.getElementById('closeBlockedDays');

    closeBlockedDays.addEventListener('click', () => {
        blockedDaysModal.classList.remove('active');
    });

    blockedDaysModal.addEventListener('click', (e) => {
        if (e.target === blockedDaysModal) {
            blockedDaysModal.classList.remove('active');
        }
    });

    const prevMonthBlocked = document.getElementById('prevMonthBlocked');
    const nextMonthBlocked = document.getElementById('nextMonthBlocked');

    if (prevMonthBlocked && nextMonthBlocked) {
        prevMonthBlocked.addEventListener('click', () => {
            state.blockedCalendarMonth--;
            if (state.blockedCalendarMonth < 0) {
                state.blockedCalendarMonth = 11;
                state.blockedCalendarYear--;
            }
            renderBlockedCalendar();
        });

        nextMonthBlocked.addEventListener('click', () => {
            state.blockedCalendarMonth++;
            if (state.blockedCalendarMonth > 11) {
                state.blockedCalendarMonth = 0;
                state.blockedCalendarYear++;
            }
            renderBlockedCalendar();
        });
    }
}

function initializeCancellationModal() {
    const modal = document.getElementById('cancellationModal');
    const closeBtn = document.getElementById('closeCancellation');
    const passwordInput = document.getElementById('cancelPassword');
    const reasonInput = document.getElementById('cancelReason');
    const requestedByInput = document.getElementById('cancelRequestedBy');
    const confirmBtn = document.getElementById('confirmCancelBtn');
    const cancelBtn = document.getElementById('cancelCancelBtn');

    const validateForm = () => {
        const password = passwordInput.value;
        const reason = reasonInput.value.trim();
        const requestedBy = requestedByInput.value.trim();

        confirmBtn.disabled = !(password === 'daqta' && reason.length >= 10 && requestedBy.length > 0);
    };

    passwordInput.addEventListener('input', validateForm);

    reasonInput.addEventListener('input', () => {
        reasonInput.value = reasonInput.value.toUpperCase();
        validateForm();
    });

    requestedByInput.addEventListener('input', () => {
        requestedByInput.value = requestedByInput.value.toUpperCase();
        validateForm();
    });

    confirmBtn.addEventListener('click', () => {
        const dateKey = modal.dataset.dateKey;
        const bookingIndex = parseInt(modal.dataset.bookingIndex);
        const reason = reasonInput.value.trim();
        const requestedBy = requestedByInput.value.trim();

        if (state.bookings[dateKey] && state.bookings[dateKey][bookingIndex]) {
            state.bookings[dateKey][bookingIndex].cancellation = {
                reason,
                requestedBy,
                timestamp: new Date().toISOString()
            };
            saveState();
            renderCalendar();
            modal.classList.remove('active');
            window.dispatchEvent(new CustomEvent('showReport'));
            alert('Reserva cancelada com sucesso!');
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function initializeCustomizeDayModal() {
    const customizeDayModal = document.getElementById('customizeDayModal');
    const closeCustomizeDay = document.getElementById('closeCustomizeDay');

    closeCustomizeDay.addEventListener('click', () => {
        customizeDayModal.classList.remove('active');
    });

    customizeDayModal.addEventListener('click', (e) => {
        if (e.target === customizeDayModal) {
            customizeDayModal.classList.remove('active');
        }
    });

    const prevMonthCustomize = document.getElementById('prevMonthCustomize');
    const nextMonthCustomize = document.getElementById('nextMonthCustomize');

    if (prevMonthCustomize && nextMonthCustomize) {
        prevMonthCustomize.addEventListener('click', () => {
            state.customizeCalendarMonth--;
            if (state.customizeCalendarMonth < 0) {
                state.customizeCalendarMonth = 11;
                state.customizeCalendarYear--;
            }
            renderCustomizeCalendar();
        });

        nextMonthCustomize.addEventListener('click', () => {
            state.customizeCalendarMonth++;
            if (state.customizeCalendarMonth > 11) {
                state.customizeCalendarMonth = 0;
                state.customizeCalendarYear++;
            }
            renderCustomizeCalendar();
        });
    }
}

function initializeCustomizeDayFormModal() {
    const modal = document.getElementById('customizeDayFormModal');
    const closeBtn = document.getElementById('closeCustomizeDayForm');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function initializeSearchBookingsModal() {
    const modal = document.getElementById('searchBookingsModal');
    const closeBtn = document.getElementById('closeSearchBookings');
    const searchBtn = document.getElementById('searchBtn');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    searchBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('performSearchBookings'));
    });
    
    // Allow Enter key to search
    document.getElementById('searchCpf').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.dispatchEvent(new CustomEvent('performSearchBookings'));
        }
    });
}

function initializeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.getElementById('closeConfirmation');
    const closeBtnMain = document.getElementById('closeConfirmationBtn');
    const shareWhatsApp = document.getElementById('shareWhatsApp');
    const shareEmail = document.getElementById('shareEmail');
    const downloadPDF = document.getElementById('downloadPDF');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    closeBtnMain.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    shareWhatsApp.addEventListener('click', () => {
        const bookingInfo = JSON.parse(modal.dataset.bookingInfo);
        const message = `🏥 *COMPROVANTE DE AGENDAMENTO - FISIOTERAPIA*\n\n` +
                       `📅 *Data:* ${bookingInfo.date}\n` +
                       `⏰ *Período:* ${bookingInfo.period}\n` +
                       `🕐 *Horário:* ${bookingInfo.time}\n` +
                       `👤 *Paciente:* ${bookingInfo.name}\n` +
                       `📱 *WhatsApp:* ${bookingInfo.phone}\n` +
                       `📋 *CPF:* ${bookingInfo.cpf}\n` +
                       `✅ *Confirmado em:* ${bookingInfo.timestamp}`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    });
    
    shareEmail.addEventListener('click', () => {
        const bookingInfo = JSON.parse(modal.dataset.bookingInfo);
        const subject = 'Comprovante de Agendamento - Fisioterapia';
        const body = `COMPROVANTE DE AGENDAMENTO - FISIOTERAPIA\n\n` +
                    `Data: ${bookingInfo.date}\n` +
                    `Período: ${bookingInfo.period}\n` +
                    `Horário: ${bookingInfo.time}\n` +
                    `Paciente: ${bookingInfo.name}\n` +
                    `WhatsApp: ${bookingInfo.phone}\n` +
                    `CPF: ${bookingInfo.cpf}\n` +
                    `Confirmado em: ${bookingInfo.timestamp}`;
        
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    });
    
    downloadPDF.addEventListener('click', () => {
        const bookingInfo = JSON.parse(modal.dataset.bookingInfo);
        generateBookingPDF(bookingInfo);
    });
}

function generateBookingPDF(bookingInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('COMPROVANTE DE AGENDAMENTO', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Fisioterapia', 105, 40, { align: 'center' });
    
    // Booking details box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(20, 55, 170, 100);
    
    let yPos = 70;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    
    doc.text('Tipo:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.type, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Data:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.date, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Período:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.period, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Horário:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.time, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Paciente:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.name, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text(bookingInfo.docLabel + ':', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.doc, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('WhatsApp:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.phone, 80, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'bold');
    doc.text('Confirmado em:', 30, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(bookingInfo.timestamp, 80, yPos);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(128);
    doc.text('Guarde este comprovante para apresentar no dia do atendimento.', 105, 170, { align: 'center' });
    
    // Save
    doc.save(`comprovante_agendamento_${bookingInfo.date.replace(/\s/g, '_')}.pdf`);
}

// Make viewAllMonthBookings globally available
window.viewAllMonthBookings = viewAllMonthBookings;

export function showCancellationModal(dateKey, bookingIndex) {
    const modal = document.getElementById('cancellationModal');
    modal.dataset.dateKey = dateKey;
    modal.dataset.bookingIndex = bookingIndex;
    modal.classList.add('active');

    document.getElementById('cancelPassword').value = '';
    document.getElementById('cancelReason').value = '';
    document.getElementById('cancelRequestedBy').value = '';
    document.getElementById('confirmCancelBtn').disabled = true;
}

function initializeBookingPasswordModal() {
    const modal = document.getElementById('bookingPasswordModal');
    const closeBtn = document.getElementById('closeBookingPassword');
    const passwordInput = document.getElementById('bookingPasswordInput');
    const confirmBtn = document.getElementById('confirmBookingPassword');
    const cancelBtn = document.getElementById('cancelBookingPassword');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        passwordInput.value = '';
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        passwordInput.value = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            passwordInput.value = '';
        }
    });
    
    confirmBtn.addEventListener('click', () => {
        const enteredPassword = passwordInput.value;
        const correctPassword = state.bookingPassword?.password;
        
        if (enteredPassword === correctPassword) {
            modal.classList.remove('active');
            passwordInput.value = '';
            const day = parseInt(modal.dataset.day);
            window.dispatchEvent(new CustomEvent('openBookingModalDirect', { detail: { day } }));
        } else {
            alert('Senha incorreta!');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });
}

function initializeSetBookingPasswordModal() {
    const modal = document.getElementById('setBookingPasswordModal');
    const closeBtn = document.getElementById('closeSetBookingPassword');
    const cancelBtn = document.getElementById('cancelSetPassword');
    const saveBtn = document.getElementById('savePasswordBtn');
    const disableBtn = document.getElementById('disablePasswordBtn');
    const newPasswordInput = document.getElementById('newBookingPassword');
    const confirmPasswordInput = document.getElementById('confirmBookingPassword2');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    saveBtn.addEventListener('click', () => {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        if (!newPassword) {
            alert('Por favor, digite uma senha.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (newPassword.length < 4) {
            alert('A senha deve ter pelo menos 4 caracteres.');
            return;
        }
        
        state.bookingPassword = {
            enabled: true,
            password: newPassword
        };
        
        saveState();
        alert('Senha de agendamento salva com sucesso!');
        modal.classList.remove('active');
    });
    
    disableBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja desabilitar a senha de agendamento?')) {
            state.bookingPassword = {
                enabled: false,
                password: null
            };
            saveState();
            alert('Senha de agendamento desabilitada!');
            modal.classList.remove('active');
        }
    });
}

function initializeStatisticsModal() {
    const modal = document.getElementById('statisticsModal');
    const closeBtn = document.getElementById('closeStatistics');
    const monthSelect = document.getElementById('statsMonthSelect');
    const yearSelect = document.getElementById('statsYearSelect');
    
    // Populate month and year selects
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    
    monthSelect.value = state.currentMonth;
    yearSelect.value = state.currentYear;
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function viewAllMonthBookings(month, year) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const reportModal = document.getElementById('reportModal');
    const reportContent = document.getElementById('reportContent');
    
    let html = `<h2 style="margin-bottom: 20px;">Todos os Agendamentos - ${months[month]} ${year}</h2>`;
    
    const monthBookings = {};
    Object.keys(state.bookings).forEach(dateKey => {
        const [bookingYear, bookingMonth] = dateKey.split('-').map(Number);
        if (bookingYear === year && bookingMonth === month) {
            monthBookings[dateKey] = state.bookings[dateKey];
        }
    });
    
    const bookingEntries = Object.entries(monthBookings).sort();
    
    if (bookingEntries.length === 0) {
        html += '<p class="no-bookings">Nenhum agendamento encontrado para este mês.</p>';
    } else {
        bookingEntries.forEach(([dateKey, bookings]) => {
            const [year, month, day] = dateKey.split('-').map(Number);
            const monthConfig = state.configurations[`${year}-${month}`];

            html += `<div class="report-date-group">
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

                const cleanPhone = booking.phone.replace(/\D/g, '');
                const whatsappLink = `https://wa.me/55${cleanPhone}`;
                const formattedDoc = booking.cpf 
                    ? booking.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                    : booking.re || 'N/A';
                const docLabel = booking.type === 'militar' ? 'RE' : 'CPF';
                const patientType = booking.type === 'militar' ? 'Militar' : 'Civil';
                
                html += `
                    <div class="report-booking-card" style="page-break-inside: avoid;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background: var(--bg-primary);">
                                <td colspan="2" style="padding: 12px; border-bottom: 2px solid var(--border-color);">
                                    <strong style="font-size: 16px;">${periodName}</strong>
                                    <span style="float: right; color: var(--text-secondary);">${periodTime}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; width: 30%; font-weight: 600;">Tipo:</td>
                                <td style="padding: 8px;">${patientType}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; width: 30%; font-weight: 600;">Paciente:</td>
                                <td style="padding: 8px;">${booking.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; width: 30%; font-weight: 600;">${docLabel}:</td>
                                <td style="padding: 8px;">${formattedDoc}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; width: 30%; font-weight: 600;">WhatsApp:</td>
                                <td style="padding: 8px;">
                                    <a href="${whatsappLink}" target="_blank" class="whatsapp-link">${booking.phone}</a>
                                    <a href="${whatsappLink}" target="_blank" class="whatsapp-icon" title="Abrir WhatsApp">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
                                    </a>
                                </td>
                            </tr>
                            ${booking.complaint ? `
                            <tr>
                                <td style="padding: 8px; width: 30%; font-weight: 600; vertical-align: top;">Queixa:</td>
                                <td style="padding: 8px;">${booking.complaint}</td>
                            </tr>
                            ` : ''}
                            <tr style="border-top: 1px solid var(--border-color);">
                                <td colspan="2" style="padding: 8px; font-size: 12px; color: var(--text-secondary);">
                                    Reservado em: ${new Date(booking.timestamp).toLocaleString('pt-BR')}
                                </td>
                            </tr>
                            ${booking.cancellation ? `
                            <tr style="background: #ffebee;">
                                <td colspan="2" style="padding: 12px; border-left: 4px solid #f44336;">
                                    <strong style="color: #f44336;">CANCELADO</strong><br>
                                    Motivo: ${booking.cancellation.reason}<br>
                                    Solicitado por: ${booking.cancellation.requestedBy}<br>
                                    Cancelado em: ${new Date(booking.cancellation.timestamp).toLocaleString('pt-BR')}
                                </td>
                            </tr>
                            ` : `
                            <tr>
                                <td colspan="2" style="padding: 12px; text-align: center;">
                                    <button class="btn-cancel" data-date="${dateKey}" data-index="${bookingIndex}">Cancelar Reserva</button>
                                </td>
                            </tr>
                            `}
                        </table>
                    </div>
                `;
            });

            html += `</div></div>`;
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

export function showStatistics() {
    const modal = document.getElementById('statisticsModal');
    const monthSelect = document.getElementById('statsMonthSelect');
    const yearSelect = document.getElementById('statsYearSelect');
    const content = document.getElementById('statisticsContent');
    
    monthSelect.value = state.currentMonth;
    yearSelect.value = state.currentYear;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <p style="color: var(--text-secondary); font-size: 16px; margin-bottom: 20px;">
                Selecione o mês e ano acima e clique em "Buscar" para visualizar as estatísticas
            </p>
            <button id="searchStatsBtn" class="btn-primary">Buscar</button>
        </div>
    `;
    
    document.getElementById('searchStatsBtn').addEventListener('click', () => {
        renderStatistics();
    });
    
    modal.classList.add('active');
}

function renderStatistics() {
    const content = document.getElementById('statisticsContent');
    const monthSelect = document.getElementById('statsMonthSelect');
    const yearSelect = document.getElementById('statsYearSelect');
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const configKey = `${year}-${month}`;
    const monthConfig = state.configurations[configKey];
    
    if (!monthConfig) {
        content.innerHTML = `
            <p class="no-statistics">Nenhuma configuração encontrada para este mês.</p>
            <button class="btn-primary" onclick="viewAllMonthBookings(${month}, ${year})" style="margin-top: 20px;">
                Ver Todos os Agendamentos do Mês
            </button>
            <button id="searchStatsBtn2" class="btn-secondary" style="margin-top: 12px; margin-left: 12px;">
                Nova Busca
            </button>
        `;
        
        document.getElementById('searchStatsBtn2')?.addEventListener('click', () => {
            showStatistics();
        });
        return;
    }
    
    // Calculate occupancy by period
    const periodStats = calculatePeriodOccupancy(month, year, monthConfig);
    
    // Render chart
    let html = `
        <div style="margin-bottom: 20px;">
            <button class="btn-primary" onclick="viewAllMonthBookings(${month}, ${year})">
                Ver Todos os Agendamentos do Mês
            </button>
            <button id="searchStatsBtn3" class="btn-secondary" style="margin-left: 12px;">
                Nova Busca
            </button>
        </div>
        
        <h3 style="margin-bottom: 20px; font-size: 20px;">Ocupação por Período - ${months[month]} ${year}</h3>
        
        <div class="occupancy-chart">
            ${renderOccupancyChart(periodStats)}
        </div>
        
        <div class="occupancy-legend">
            <div class="legend-item">
                <div class="legend-color" style="background: #4caf50;"></div>
                <span>Vagas Livres</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #f44336;"></div>
                <span>Vagas Ocupadas</span>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    document.getElementById('searchStatsBtn3')?.addEventListener('click', () => {
        showStatistics();
    });
}

function calculatePeriodOccupancy(month, year, monthConfig) {
    // Return per-period totals plus breakdown by category: civis, militares copom, militares outros
    const periodStats = {
        'Manhã': { total: 0, civis: 0, mil_copom: 0, mil_outros: 0 },
        'Tarde': { total: 0, civis: 0, mil_copom: 0, mil_outros: 0 },
        'Noite': { total: 0, civis: 0, mil_copom: 0, mil_outros: 0 }
    };
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month}-${day}`;
        const dayOfWeek = new Date(year, month, day).getDay();
        
        // Get effective configuration for this day
        const customConfig = state.customDayConfigurations && state.customDayConfigurations[dateKey];
        let effectiveConfig = null;
        
        if (customConfig) {
            effectiveConfig = customConfig;
        } else if (monthConfig && monthConfig.daysConfig) {
            const withinRange = day >= (monthConfig.startDay || 1) && day <= (monthConfig.endDay || daysInMonth);
            if (withinRange && monthConfig.daysConfig[dayOfWeek]) {
                effectiveConfig = monthConfig.daysConfig[dayOfWeek];
            }
        }
        
        if (!effectiveConfig || state.blockedDays[dateKey]) continue;
        
        const dayBookings = state.bookings[dateKey] || [];
        
        effectiveConfig.periods.forEach((period, index) => {
            const periodName = period.name;
            if (!periodStats[periodName]) return;
            const slots = period.slots || 1;
            periodStats[periodName].total += slots;
            
            // Count bookings per category
            const activeBookings = dayBookings.filter(b => b.periodIndex === index && !b.cancellation);
            activeBookings.forEach(b => {
                if (b.type === 'civil' || (b.type === undefined && b.cpf)) {
                    periodStats[periodName].civis += 1;
                } else {
                    // military
                    if (b.unit === 'copom') periodStats[periodName].mil_copom += 1;
                    else periodStats[periodName].mil_outros += 1;
                }
            });
        });
    }
    
    return periodStats;
}

function renderOccupancyChart(periodStats) {
    let html = '';
    
    Object.keys(periodStats).forEach(periodName => {
        const stats = periodStats[periodName];
        
        if (stats.total === 0) return;
        
        // breakdown counts
        const civis = stats.civis || 0;
        const copom = stats.mil_copom || 0;
        const outros = stats.mil_outros || 0;
        const occupied = civis + copom + outros;
        const free = Math.max(0, stats.total - occupied);
        
        const civisPct = ((civis / stats.total) * 100).toFixed(1);
        const copomPct = ((copom / stats.total) * 100).toFixed(1);
        const outrosPct = ((outros / stats.total) * 100).toFixed(1);
        const freePct = ((free / stats.total) * 100).toFixed(1);
        
        html += `
            <div class="chart-row">
                <div class="chart-label">
                    <strong>${periodName}</strong>
                    <span>${occupied} / ${stats.total} vagas ocupadas</span>
                </div>
                <div class="chart-bar-container">
                    <div class="chart-bar-segment occupied" style="width: ${copomPct}% ; background: #6a1b9a;" title="${copom} militares COPOM (${copomPct}%)">
                        ${copomPct > 12 ? `${copomPct}%` : ''}
                    </div>
                    <div class="chart-bar-segment occupied" style="width: ${outrosPct}% ; background: #ff7043;" title="${outros} militares Outros (${outrosPct}%)">
                        ${outrosPct > 12 ? `${outrosPct}%` : ''}
                    </div>
                    <div class="chart-bar-segment occupied" style="width: ${civisPct}% ; background: #f44336;" title="${civis} civis (${civisPct}%)">
                        ${civisPct > 12 ? `${civisPct}%` : ''}
                    </div>
                    <div class="chart-bar-segment free" style="width: ${freePct}%;" title="${free} livres (${freePct}%)">
                        ${freePct > 12 ? `${freePct}%` : ''}
                    </div>
                </div>
                <div class="chart-stats">
                    <div class="stat-item" style="text-align:center;">
                        <span class="stat-value" style="color:#f44336">${civis}</span>
                        <span class="stat-label">Civis</span>
                    </div>
                    <div class="stat-item" style="text-align:center;">
                        <span class="stat-value" style="color:#6a1b9a">${copom}</span>
                        <span class="stat-label">Militares COPOM</span>
                    </div>
                    <div class="stat-item" style="text-align:center;">
                        <span class="stat-value" style="color:#ff7043">${outros}</span>
                        <span class="stat-label">Militares Outros</span>
                    </div>
                    <div class="stat-item" style="text-align:center;">
                        <span class="stat-value">${free}</span>
                        <span class="stat-label">Livres</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (html === '') {
        html = '<p class="no-statistics">Nenhum dado disponível para este mês.</p>';
    }
    
    return html;
}


function initializePatientSearchModal() {
    const modal = document.getElementById('patientSearchModal');
    const closeBtn = document.getElementById('closePatientSearch');
    const docInput = document.getElementById('patientDoc');
    const docLabel = document.getElementById('patientDocLabel');
    const searchBtn = document.getElementById('patientSearchBtn');
    const patientTypeRadios = document.querySelectorAll('input[name="patientType"]');

    let currentType = 'civil';

    const updateDocField = () => {
        const selectedType = document.querySelector('input[name="patientType"]:checked').value;
        currentType = selectedType;
        
        if (selectedType === 'civil') {
            docLabel.textContent = 'Digite seu CPF:';
            docInput.placeholder = '000.000.000-00';
            docInput.maxLength = 14;
        } else {
            docLabel.textContent = 'Digite seu RE (Registro):';
            docInput.placeholder = '000000-0';
            docInput.maxLength = 8;
        }
        docInput.value = '';
        searchBtn.disabled = true;
    };

    patientTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateDocField);
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        docInput.value = '';
        document.getElementById('patientSearchResults').innerHTML = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            docInput.value = '';
            document.getElementById('patientSearchResults').innerHTML = '';
        }
    });
    
    // Format document as user types
    docInput.addEventListener('input', (e) => {
        if (currentType === 'civil') {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            e.target.value = v;
            
            const cleanCpf = v.replace(/\D/g, '');
            searchBtn.disabled = cleanCpf.length !== 11;
        } else {
            let raw = e.target.value.replace(/-/g, '').toUpperCase();
            if (raw.length > 7) raw = raw.slice(0, 7);
            
            // Format as xxxxxx-x
            let formatted = raw;
            if (raw.length > 6) {
                const digits = raw.slice(0, 6).replace(/\D/g, '');
                const lastChar = raw.slice(6, 7);
                formatted = digits + '-' + lastChar;
            } else {
                formatted = raw.replace(/\D/g, '');
            }
            e.target.value = formatted;
            
            const cleanRe = raw.replace(/\D/g, '');
            searchBtn.disabled = raw.length !== 7;
        }
    });
    
    searchBtn.addEventListener('click', () => {
        searchPatientBookings(currentType);
    });
    
    docInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !searchBtn.disabled) {
            searchPatientBookings(currentType);
        }
    });
}

export function showPatientSearch() {
    const modal = document.getElementById('patientSearchModal');
    const docInput = document.getElementById('patientDoc');
    docInput.value = '';
    document.getElementById('patientSearchResults').innerHTML = '';
    document.getElementById('patientSearchBtn').disabled = true;
    
    // Reset to civil by default
    document.querySelector('input[name="patientType"][value="civil"]').checked = true;
    document.getElementById('patientDocLabel').textContent = 'Digite seu CPF:';
    docInput.placeholder = '000.000.000-00';
    docInput.maxLength = 14;
    
    modal.classList.add('active');
    docInput.focus();
}

function searchPatientBookings(type) {
    const docInput = document.getElementById('patientDoc');
    const searchResults = document.getElementById('patientSearchResults');
    
    let searchDoc = '';
    if (type === 'civil') {
        searchDoc = docInput.value.replace(/\D/g, '');
        if (searchDoc.length !== 11) {
            searchResults.innerHTML = '<p class="no-bookings">CPF deve conter 11 dígitos.</p>';
            return;
        }
    } else {
        searchDoc = docInput.value.replace(/-/g, '').trim();
        if (searchDoc.length !== 7) {
            searchResults.innerHTML = '<p class="no-bookings">RE deve conter 6 números e o dígito final letra ou número.</p>';
            return;
        }
    }
    
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let foundBookings = [];
    const now = new Date();
    
    // Search through all bookings
    Object.entries(state.bookings).forEach(([dateKey, bookings]) => {
        bookings.forEach((booking, index) => {
            const matches = type === 'civil'
                ? (booking.cpf && booking.cpf.replace(/\D/g, '') === searchDoc)
                : (booking.re && booking.re.toUpperCase() === searchDoc.toUpperCase());
            
            if (matches) {
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
                
                // Determine status
                let status = 'cancelled';
                if (!booking.cancellation && period) {
                    const [endHour, endMinute] = period.end.split(':').map(Number);
                    const bookingEndDateTime = new Date(year, month, day, endHour, endMinute);
                    
                    if (now < bookingEndDateTime) {
                        status = 'scheduled';
                    } else {
                        status = 'completed';
                    }
                }
                
                foundBookings.push({ dateKey, booking, bookingIndex: index, status, period });
            }
        });
    });
    
    if (foundBookings.length === 0) {
        if (type === 'civil') {
            searchResults.innerHTML = '<p class="no-bookings">CPF inexistente.</p>';
        } else {
            searchResults.innerHTML = '<p class="no-bookings">RE inexistente.</p>';
        }
        return;
    }
    
    // Sort by date (newest first)
    foundBookings.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    
    // Separate into categories
    const scheduled = foundBookings.filter(b => b.status === 'scheduled');
    const completed = foundBookings.filter(b => b.status === 'completed');
    const cancelled = foundBookings.filter(b => b.status === 'cancelled');
    
    let html = '<div class="report-content">';
    
    if (scheduled.length > 0) {
        html += '<h3 style="color: #4caf50; margin-bottom: 12px;">📅 Agendamentos Futuros</h3>';
        scheduled.forEach(({ dateKey, booking, period }) => {
            html += renderPatientBookingCard(dateKey, booking, period, 'scheduled', months);
        });
    }
    
    if (completed.length > 0) {
        html += '<h3 style="color: #2196F3; margin-top: 24px; margin-bottom: 12px;">✅ Atendimentos Realizados</h3>';
        completed.forEach(({ dateKey, booking, period }) => {
            html += renderPatientBookingCard(dateKey, booking, period, 'completed', months);
        });
    }
    
    if (cancelled.length > 0) {
        html += '<h3 style="color: #f44336; margin-top: 24px; margin-bottom: 12px;">❌ Cancelados</h3>';
        cancelled.forEach(({ dateKey, booking, period }) => {
            html += renderPatientBookingCard(dateKey, booking, period, 'cancelled', months);
        });
    }
    
    html += '</div>';
    searchResults.innerHTML = html;
}

function renderPatientBookingCard(dateKey, booking, period, status, months) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const periodName = period ? period.name : 'Período desconhecido';
    const periodTime = period ? `${period.start} - ${period.end}` : '';
    const formattedDoc = booking.cpf 
        ? booking.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : booking.re || 'N/A';
    const docLabel = booking.type === 'militar' ? 'RE' : 'CPF';
    const patientType = booking.type === 'militar' ? 'Militar' : 'Civil';
    
    let statusBadge = '';
    if (status === 'scheduled') {
        statusBadge = '<span style="background: #4caf50; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">AGENDADO</span>';
    } else if (status === 'completed') {
        statusBadge = '<span style="background: #2196F3; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">REALIZADO</span>';
    } else if (status === 'cancelled') {
        statusBadge = '<span style="background: #f44336; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">CANCELADO</span>';
    }
    
    return `
        <div class="report-booking-card" style="margin-bottom: 12px; page-break-inside: avoid;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: var(--bg-primary);">
                    <td colspan="2" style="padding: 12px; border-bottom: 2px solid var(--border-color);">
                        <strong style="font-size: 16px;">${day} de ${months[month]} de ${year}</strong>
                        <span style="float: right;">${statusBadge}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">Tipo:</td>
                    <td style="padding: 8px;">${patientType}</td>
                </tr>
                ${booking.rank ? `
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">Graduação:</td>
                    <td style="padding: 8px;">${booking.rank}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">Período:</td>
                    <td style="padding: 8px;">${periodName} (${periodTime})</td>
                </tr>
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">Paciente:</td>
                    <td style="padding: 8px;">${booking.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">${docLabel}:</td>
                    <td style="padding: 8px;">${formattedDoc}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600;">WhatsApp:</td>
                    <td style="padding: 8px;">${booking.phone}</td>
                </tr>
                ${booking.complaint ? `
                <tr>
                    <td style="padding: 8px; width: 30%; font-weight: 600; vertical-align: top;">Queixa:</td>
                    <td style="padding: 8px;">${booking.complaint}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 1px solid var(--border-color);">
                    <td colspan="2" style="padding: 8px; font-size: 12px; color: var(--text-secondary);">
                        Reservado em: ${new Date(booking.timestamp).toLocaleString('pt-BR')}
                    </td>
                </tr>
                ${booking.cancellation ? `
                <tr style="background: #ffebee;">
                    <td colspan="2" style="padding: 12px; border-left: 4px solid #f44336;">
                        <strong style="color: #f44336;">CANCELADO</strong><br>
                        Motivo: ${booking.cancellation.reason}<br>
                        Solicitado por: ${booking.cancellation.requestedBy}<br>
                        Cancelado em: ${new Date(booking.cancellation.timestamp).toLocaleString('pt-BR')}
                    </td>
                </tr>
                ` : ''}
            </table>
        </div>
    `;
}