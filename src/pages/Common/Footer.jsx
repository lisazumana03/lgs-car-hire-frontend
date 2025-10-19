function Footer(){
    return(
        <footer style={{
            backgroundColor: '#0c0c0f',
            color: '#e0e0e0',
            padding: '40px 60px',
            textAlign: 'center',
            borderTop: '1px solid rgba(212, 175, 55, 0.3)',
            marginTop: '40px'
        }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#3c37d4', marginBottom: '15px' }}>
                LG'S CAR HIRE
            </div>
            <p>&copy; {new Date().getFullYear()} LG's Car Hire. All rights reserved.</p>
        </footer>
    );
}
export default Footer;