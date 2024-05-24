import { allure } from 'allure-playwright';

export async function allureStep(name: string, step: () => Promise<void>) {
  await allure.step(name, step);
}
