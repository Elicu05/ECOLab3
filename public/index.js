document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role);
                if (data.storeId) {
                    localStorage.setItem('storeId', data.storeId);
                }
                
                // Redirect based on role
                switch (data.role) {
                    case 'user':
                        window.location.href = '/user';
                        break;
                    case 'store':
                        window.location.href = '/restaurant';
                        break;
                    case 'rider':
                        window.location.href = '/delivery';
                        break;
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        }
    });
});
