import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LightningService } from './lightning.service';

describe('LightningService', () => {
  let service: LightningService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LightningService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'LIGHTNING_NODE_URL':
                  return 'http://localhost:8080';
                case 'LIGHTNING_MACAROON':
                  return 'test_macaroon';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LightningService>(LightningService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateInvoice', () => {
    it('should generate a payment hash', async () => {
      const amount = 1000;
      const result = await service.generateInvoice(amount);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('lockPayment', () => {
    it('should lock a payment', async () => {
      const paymentHash = 'test_hash';
      const result = await service.lockPayment(paymentHash);
      expect(result).toBe(true);
    });
  });
}); 