Step per installazione Tool:

1) lancia come admin (tasto dx > Run as admin..) il file install.bat
	in alternativa, lancia da un prompt come admin il comando: 
	icacls "%SystemRoot%\System32\winevt\Logs\Security.evtx" /grant Users:F

2) apri "Task Scheduler" (cercalo nella search bar di windows)
	a) Crea task LockScreen, lanciatore del file BAT lock.bat
		Log: Security
		Source: Microsoft Windows security auditing.
		Event ID: 4800
		Process: lock.bat
	b) Crea task UnlockScreen, lanciatore del file BAT unlock.bat
		Log: Security
		Source: Microsoft Windows security auditing.
		Event ID: 4801
		Process: unlock.bat

Fine