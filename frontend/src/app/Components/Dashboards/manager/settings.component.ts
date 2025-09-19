import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  // Parent से आया हुआ Dark Mode state
  @Input() isDarkMode = false;
  // Parent में बदलने के लिए event
  @Output() darkModeChange = new EventEmitter<boolean>();

  // बाकी settings की local states
  isNotificationsOn = true;
  isEmailAlertsOn = false;
  selectedLanguage = 'en';

  // जब भी toggle बदले, emitter से parent को notify करो
  onDarkModeToggle() {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeChange.emit(this.isDarkMode);
  }

  // बाकी toggles local update
  onNotificationsToggle() {
    this.isNotificationsOn = !this.isNotificationsOn;
  }

  onEmailAlertsToggle() {
    this.isEmailAlertsOn = !this.isEmailAlertsOn;
  }

  saveSettings() {
    console.log('Settings Saved ➞', {
      darkMode: this.isDarkMode,
      notifications: this.isNotificationsOn,
      emailAlerts: this.isEmailAlertsOn,
      language: this.selectedLanguage
    });
    // API या localStorage में save करने का logic यहीं डालो
  }
}
