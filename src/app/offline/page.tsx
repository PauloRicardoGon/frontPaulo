const OfflinePage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 p-6 text-center">
    <h1 className="text-3xl font-semibold text-neutral-800">Você está offline</h1>
    <p className="mt-4 max-w-md text-neutral-600">
      Continue registrando clientes e equipamentos normalmente. Assim que a conexão for
      restabelecida, enviaremos os dados pendentes automaticamente.
    </p>
  </div>
);

export default OfflinePage;
