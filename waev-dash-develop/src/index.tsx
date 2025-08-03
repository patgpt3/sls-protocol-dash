import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import { Provider } from 'react-redux';
import { store } from 'store';

// Waev Dashboard Context Provider
import { MaterialUIControllerProvider } from 'contexts';

export const RenderApp = (
  <Provider store={store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(RenderApp, document.getElementById('root'));
