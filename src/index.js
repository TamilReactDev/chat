import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './chat/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './chat/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	
	
	<AuthContextProvider>
			<App></App>
	</AuthContextProvider>
		



	
		
	
)





