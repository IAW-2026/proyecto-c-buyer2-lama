async function main() {
  console.log('Buyer DB seed: no external app data is persisted here.');
  console.log('Seller, shipping and payments data are served from mocks.');
}

main().catch((error) => {
  console.error('Error seeding Buyer database:', error);
  process.exit(1);
});
