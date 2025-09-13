import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    age?: number;
    weight?: number;
    height?: number;
    medical_condition?: string[];
    dietary_preferences?: string[];
    allergens?: string[];
    weekly_budget?: number;
    goal: string;
};

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const [customMedicalCondition, setCustomMedicalCondition] = useState('');
    const [customDietaryPref, setCustomDietaryPref] = useState('');
    const [customAllergen, setCustomAllergen] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        age: undefined,
        weight: undefined,
        height: undefined,
        medical_condition: [],
        dietary_preferences: [],
        allergens: [],
        weekly_budget: undefined,
        goal: 'balanced',
    });

    const totalSteps = 4;

    const medicalConditions = [
        'diabetes',
        'hypertension',
        'heart_disease',
        'kidney_disease',
        'liver_disease',
        'celiac_disease',
        'thyroid_disorder',
    ];

    const dietaryPrefs = [
        'vegetarian',
        'vegan',
        'gluten_free',
        'dairy_free',
        'low_sodium',
        'low_sugar',
        'high_protein',
        'mediterranean',
        'keto',
    ];

    const commonAllergens = [
        'nuts',
        'shellfish',
        'fish',
        'eggs',
        'dairy',
        'soy',
        'wheat',
        'sesame',
    ];

    const handleCheckboxChange = (field: 'medical_condition' | 'dietary_preferences' | 'allergens', value: string, checked: boolean) => {
        const currentValues = data[field] || [];
        if (checked) {
            setData(field, [...currentValues, value]);
        } else {
            setData(field, currentValues.filter(item => item !== value));
        }
    };

    const addCustomOption = (field: 'medical_condition' | 'dietary_preferences' | 'allergens', value: string, setValue: (value: string) => void) => {
        if (value.trim() && !(data[field] || []).includes(value.trim())) {
            const currentValues = data[field] || [];
            setData(field, [...currentValues, value.trim()]);
            setValue('');
        }
    };

    const removeCustomOption = (field: 'medical_condition' | 'dietary_preferences' | 'allergens', value: string) => {
        const currentValues = data[field] || [];
        setData(field, currentValues.filter(item => item !== value));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(data.name && data.email && data.password && data.password_confirmation);
            case 2:
                return !!data.goal;
            case 3:
                return true; // Personal details are optional
            case 4:
                return true; // Medical/dietary info is optional
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (currentStep === totalSteps) {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Información de la Cuenta</h3>
                            <p className="text-sm text-muted-foreground">Comencemos con los detalles básicos de tu cuenta</p>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre completo"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="correo@ejemplo.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Contraseña"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirmar contraseña"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Objetivo de Salud</h3>
                            <p className="text-sm text-muted-foreground">¿Cuál es tu objetivo principal de salud?</p>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="goal">Objetivo Principal</Label>
                            <Select value={data.goal} onValueChange={(value) => setData('goal', value)} disabled={processing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu objetivo principal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weight_loss">Pérdida de Peso</SelectItem>
                                    <SelectItem value="muscle_gain">Ganancia Muscular</SelectItem>
                                    <SelectItem value="diabetes_control">Control de Diabetes</SelectItem>
                                    <SelectItem value="hypertension_control">Control de Hipertensión</SelectItem>
                                    <SelectItem value="balanced">Dieta Balanceada</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.goal} />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Detalles Personales</h3>
                            <p className="text-sm text-muted-foreground">Ayúdanos a personalizar tu plan nutricional (opcional)</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="age">Edad</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={data.age || ''}
                                    onChange={(e) => setData('age', e.target.value ? parseInt(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Edad"
                                />
                                <InputError message={errors.age} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="weight">Peso (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="999.99"
                                    value={data.weight || ''}
                                    onChange={(e) => setData('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Peso"
                                />
                                <InputError message={errors.weight} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="height">Altura (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="999.99"
                                    value={data.height || ''}
                                    onChange={(e) => setData('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Altura"
                                />
                                <InputError message={errors.height} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weekly_budget">Presupuesto Semanal ($)</Label>
                            <Input
                                id="weekly_budget"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.weekly_budget || ''}
                                onChange={(e) => setData('weekly_budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                                disabled={processing}
                                placeholder="Presupuesto semanal para comida"
                            />
                            <InputError message={errors.weekly_budget} />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Información de Salud y Dieta</h3>
                            <p className="text-sm text-muted-foreground">Cuéntanos sobre tus condiciones de salud y preferencias (opcional)</p>
                        </div>

                        {/* Medical Conditions */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Condiciones Médicas</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {medicalConditions.map((condition) => (
                                    <div key={condition} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`medical_${condition}`}
                                            checked={(data.medical_condition || []).includes(condition)}
                                            onCheckedChange={(checked) => 
                                                handleCheckboxChange('medical_condition', condition, checked as boolean)
                                            }
                                            disabled={processing}
                                        />
                                        <Label 
                                            htmlFor={`medical_${condition}`} 
                                            className="text-sm font-normal capitalize"
                                        >
                                            {condition.replace('_', ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Custom medical conditions */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Agregar condición médica personalizada"
                                        value={customMedicalCondition}
                                        onChange={(e) => setCustomMedicalCondition(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomOption('medical_condition', customMedicalCondition, setCustomMedicalCondition);
                                            }
                                        }}
                                        disabled={processing}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => addCustomOption('medical_condition', customMedicalCondition, setCustomMedicalCondition)}
                                        disabled={processing || !customMedicalCondition.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {/* Display custom medical conditions */}
                                {(data.medical_condition || []).filter(condition => !medicalConditions.includes(condition)).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(data.medical_condition || [])
                                            .filter(condition => !medicalConditions.includes(condition))
                                            .map((condition) => (
                                                <div key={condition} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                                    <span>{condition}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0"
                                                        onClick={() => removeCustomOption('medical_condition', condition)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.medical_condition} />
                        </div>

                        {/* Dietary Preferences */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Preferencias Dietéticas</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {dietaryPrefs.map((pref) => (
                                    <div key={pref} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`dietary_${pref}`}
                                            checked={(data.dietary_preferences || []).includes(pref)}
                                            onCheckedChange={(checked) => 
                                                handleCheckboxChange('dietary_preferences', pref, checked as boolean)
                                            }
                                            disabled={processing}
                                        />
                                        <Label 
                                            htmlFor={`dietary_${pref}`} 
                                            className="text-sm font-normal capitalize"
                                        >
                                            {pref.replace('_', ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Custom dietary preferences */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Agregar preferencia dietética personalizada"
                                        value={customDietaryPref}
                                        onChange={(e) => setCustomDietaryPref(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomOption('dietary_preferences', customDietaryPref, setCustomDietaryPref);
                                            }
                                        }}
                                        disabled={processing}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => addCustomOption('dietary_preferences', customDietaryPref, setCustomDietaryPref)}
                                        disabled={processing || !customDietaryPref.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {/* Display custom dietary preferences */}
                                {(data.dietary_preferences || []).filter(pref => !dietaryPrefs.includes(pref)).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(data.dietary_preferences || [])
                                            .filter(pref => !dietaryPrefs.includes(pref))
                                            .map((pref) => (
                                                <div key={pref} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                                    <span>{pref}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0"
                                                        onClick={() => removeCustomOption('dietary_preferences', pref)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.dietary_preferences} />
                        </div>

                        {/* Allergens */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Alérgenos</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {commonAllergens.map((allergen) => (
                                    <div key={allergen} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`allergen_${allergen}`}
                                            checked={(data.allergens || []).includes(allergen)}
                                            onCheckedChange={(checked) => 
                                                handleCheckboxChange('allergens', allergen, checked as boolean)
                                            }
                                            disabled={processing}
                                        />
                                        <Label 
                                            htmlFor={`allergen_${allergen}`} 
                                            className="text-sm font-normal capitalize"
                                        >
                                            {allergen}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Custom allergens */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Agregar alérgeno personalizado"
                                        value={customAllergen}
                                        onChange={(e) => setCustomAllergen(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomOption('allergens', customAllergen, setCustomAllergen);
                                            }
                                        }}
                                        disabled={processing}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => addCustomOption('allergens', customAllergen, setCustomAllergen)}
                                        disabled={processing || !customAllergen.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {/* Display custom allergens */}
                                {(data.allergens || []).filter(allergen => !commonAllergens.includes(allergen)).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(data.allergens || [])
                                            .filter(allergen => !commonAllergens.includes(allergen))
                                            .map((allergen) => (
                                                <div key={allergen} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                                    <span>{allergen}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0"
                                                        onClick={() => removeCustomOption('allergens', allergen)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.allergens} />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AuthLayout title="Crear una cuenta" description="Ingresa tus datos para crear tu cuenta">
            <Head title="Registro" />
            
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Paso {currentStep} de {totalSteps}</span>
                    <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="min-h-[400px]">
                    {renderStep()}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1 || processing}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>

                    {currentStep < totalSteps ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!validateStep(currentStep) || processing}
                            className="flex items-center gap-2"
                        >
                            Continuar
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear cuenta
                        </Button>
                    )}
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={route('login')}>
                        Iniciar sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
