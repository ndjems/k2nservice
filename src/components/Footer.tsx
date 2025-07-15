


const Footer = () => {
  return (
    <footer className="bg-pink-200 text-gray-800 py-2 fixed bottom-0 left-0 z-50 w-full">
  <div className="container mx-auto text-center max-w-5xl">

      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} K2N Services. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          
        </p>
      </div>
    </div>
    </footer>
  );
}

export default Footer;