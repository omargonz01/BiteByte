const Recipes = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '20vh',
        padding: '12px',
        backgroundColor: '#E7EFED'  
      }}>
        <div style={{
          maxWidth: '768px',
          width: '100%',
          backgroundColor: '#FEFDF8',  
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <h1 style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#5A6D57',  
            marginBottom: '1px'
          }}>Recipes</h1>
          <h1 style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#5A6D57',  
            marginBottom: '16px'
          }}>Coming soon</h1>
          <p style={{
            fontSize: '16px',
            color: '#222222'  
          }}>
            Discover and share recipes. Need ideas for a healthy meal - look no further! 🍴
          </p>
        </div>
      </div>
    );
  };
  
  export default Recipes;